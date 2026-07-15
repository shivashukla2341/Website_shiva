import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CheckoutInput } from "@/lib/validations/checkout";

export class CheckoutError extends Error {}

/**
 * Creates an order from the current user's cart selection.
 *
 * Writes that must respect the buyer's own row (orders, order_items) go
 * through the request-scoped client so RLS applies normally. Inventory
 * decrements are staff/seller-only under RLS (see
 * supabase/migrations/00000000000005_products_and_variants.sql), so those
 * go through the service-role admin client instead — this is the one place
 * a checkout is allowed to move stock on someone else's behalf.
 *
 * Payment collection (Razorpay/Stripe) is wired in a later step; today this
 * places the order as `pending` and relies on Cash on Delivery semantics
 * until the payment-provider integration lands.
 */
export async function createOrderFromCheckout(userId: string, input: CheckoutInput) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: address, error: addressError } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", input.addressId)
    .eq("user_id", userId)
    .single();
  if (addressError || !address) throw new CheckoutError("Delivery address not found");

  type VariantWithProduct = {
    id: string;
    sku: string;
    price: number;
    stock_quantity: number;
    image_url: string | null;
    product_id: string;
    products: { name: string; tax_rate: number; seller_id: string | null } | null;
  };

  const variantIds = input.items.map((i) => i.variantId);
  const { data: variants, error: variantsError } = await admin
    .from("product_variants")
    .select("id, sku, price, stock_quantity, image_url, product_id, products ( name, tax_rate, seller_id )")
    .in("id", variantIds);
  if (variantsError) throw new CheckoutError("Could not load cart items");

  const typedVariants = (variants ?? []) as unknown as VariantWithProduct[];
  const variantMap = new Map(typedVariants.map((v) => [v.id, v]));

  let subtotal = 0;
  let taxTotal = 0;
  const lineItems: {
    variantId: string;
    productId: string;
    sellerId: string | null;
    name: string;
    sku: string;
    image: string | null;
    unitPrice: number;
    quantity: number;
    taxAmount: number;
    total: number;
  }[] = [];

  for (const item of input.items) {
    const variant = variantMap.get(item.variantId);
    if (!variant) throw new CheckoutError("One of your cart items is no longer available");
    if (variant.stock_quantity < item.quantity) {
      throw new CheckoutError(`Insufficient stock for ${variant.products?.name ?? "an item"}`);
    }

    const lineSubtotal = variant.price * item.quantity;
    const taxRate = variant.products?.tax_rate ?? 0;
    const taxAmount = Math.round(lineSubtotal * (taxRate / 100));

    subtotal += lineSubtotal;
    taxTotal += taxAmount;

    lineItems.push({
      variantId: variant.id,
      productId: variant.product_id,
      sellerId: variant.products?.seller_id ?? null,
      name: variant.products?.name ?? "Product",
      sku: variant.sku,
      image: variant.image_url,
      unitPrice: variant.price,
      quantity: item.quantity,
      taxAmount,
      total: lineSubtotal + taxAmount,
    });
  }

  const shippingTotal = subtotal >= 499 ? 0 : 49;
  const grandTotal = subtotal + taxTotal + shippingTotal;

  const addressSnapshot = {
    full_name: address.full_name,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postal_code: address.postal_code,
    country: address.country,
    landmark: address.landmark,
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      subtotal,
      tax_total: taxTotal,
      shipping_total: shippingTotal,
      grand_total: grandTotal,
      shipping_address: addressSnapshot,
      billing_address: addressSnapshot,
      status: "confirmed",
    })
    .select("id, order_number")
    .single();
  if (orderError || !order) throw new CheckoutError("Could not create order");

  const { error: itemsError } = await supabase.from("order_items").insert(
    lineItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      seller_id: item.sellerId,
      product_name: item.name,
      sku: item.sku,
      image_url: item.image,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      tax_amount: item.taxAmount,
      total: item.total,
    }))
  );
  if (itemsError) throw new CheckoutError("Could not save order items");

  // Decrement stock + write an audit trail row per variant (service role —
  // customers aren't granted write access to inventory under RLS).
  for (const item of lineItems) {
    const variant = variantMap.get(item.variantId)!;
    await admin
      .from("product_variants")
      .update({ stock_quantity: variant.stock_quantity - item.quantity })
      .eq("id", item.variantId);

    await admin.from("inventory_movements").insert({
      variant_id: item.variantId,
      change_quantity: -item.quantity,
      reason: "sale",
      reference_type: "order",
      reference_id: order.id,
    });
  }

  return order;
}
