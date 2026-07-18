// =============================================================================
// NEXCART — ORDERS API
// POST /api/orders — Create order
// GET /api/orders — List user orders (paginated)
// =============================================================================

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  requireAuthUser,
  withErrorHandling,
  validateBody,
  getPaginationParams,
  buildPaginatedResponse,
} from "@/lib/api/helpers";
import { checkoutSchema } from "@/lib/validators";
import { applyRateLimit, rateLimiters } from "@/lib/rate-limit";
import { sendOrderConfirmationEmail } from "@/lib/resend/emails";

// ─── GET /api/orders ─────────────────────────────────────────────────────────
export const GET = withErrorHandling(async (request: NextRequest) => {
  const limited = await applyRateLimit(request, rateLimiters.api);
  if (limited) return limited;

  const { error: authError, user } = await requireAuthUser();
  if (authError) return authError;

  const supabase = await createClient();
  const { page, limit, offset } = getPaginationParams(request.nextUrl.searchParams);

  const { data: orders, error, count } = await supabase
    .from("orders")
    .select(
      `
      id, order_number, status, payment_status, payment_method,
      subtotal, discount, shipping_charge, tax, total, coupon_code,
      shipping_address, tracking_number, tracking_url, estimated_delivery,
      delivered_at, cancelled_at, cancel_reason, created_at, updated_at,
      items:order_items(
        id, product_id, variant_id, product_name, product_image,
        variant_name, variant_options, sku, quantity, price, subtotal
      )
    `,
      { count: "exact" }
    )
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return serverErrorResponse(error);

  return successResponse(
    buildPaginatedResponse(orders ?? [], count ?? 0, page, limit)
  );
});

// ─── POST /api/orders ────────────────────────────────────────────────────────
export const POST = withErrorHandling(async (request: NextRequest) => {
  const limited = await applyRateLimit(request, rateLimiters.api);
  if (limited) return limited;

  const { error: authError, user } = await requireAuthUser();
  if (authError) return authError;

  const validation = await validateBody(request, checkoutSchema);
  if ("error" in validation) return validation.error;

  const { data } = validation;
  const supabase = await createClient();

  // 1. Fetch cart items
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select(`
      id, coupon_code,
      items:cart_items(
        id, product_id, variant_id, quantity, price,
        product:products(id, name, slug, tax_rate, tax_inclusive, images:product_images(url, is_default)),
        variant:product_variants(id, name, options, sku, image_url)
      )
    `)
    .eq("user_id", user!.id)
    .single();

  if (cartError || !cart || !cart.items || cart.items.length === 0) {
    return errorResponse("Cart is empty or not found", 400);
  }

  // 2. Validate inventory
  for (const item of cart.items) {
    if (item.variant_id) {
      const { data: inv } = await supabase
        .from("inventory_status")
        .select("in_stock, available_quantity")
        .eq("variant_id", item.variant_id)
        .single();

      if (!inv?.in_stock) {
        return errorResponse(
          `"${(item.product as any)?.name || 'Product'}" is out of stock`,
          400
        );
      }
      if ((inv.available_quantity ?? 0) < item.quantity) {
        return errorResponse(
          `Only ${inv.available_quantity} of "${(item.product as any)?.name || 'Product'}" available`,
          400
        );
      }
    }
  }

  // 3. Fetch shipping address
  const { data: address } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", data.shippingAddressId)
    .eq("user_id", user!.id)
    .single();

  if (!address) return errorResponse("Shipping address not found", 404);

  // 4. Calculate totals
  const FREE_SHIPPING_THRESHOLD = 499;
  const DEFAULT_SHIPPING = 49;
  const subtotal = cart.items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  let couponDiscount = 0;
  if (data.couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", data.couponCode)
      .eq("is_active", true)
      .single();

    if (coupon) {
      if (coupon.type === "percentage") {
        couponDiscount = Math.min(
          (subtotal * coupon.value) / 100,
          coupon.max_discount_amount ?? Infinity
        );
      } else if (coupon.type === "fixed_amount") {
        couponDiscount = Math.min(coupon.value, subtotal);
      }
    }
  }

  const discountedSubtotal = subtotal - couponDiscount;
  const shippingCharge =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING;
  const tax = (discountedSubtotal * 18) / 118;
  const total = discountedSubtotal + shippingCharge;

  // 5. Create order in transaction
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user!.id,
      order_number: "", // Generated by trigger
      status: "pending",
      payment_status: "pending",
      payment_method: data.paymentMethod,
      subtotal,
      discount: 0,
      coupon_code: data.couponCode || null,
      coupon_discount: couponDiscount,
      shipping_charge: shippingCharge,
      tax,
      total,
      shipping_address: {
        firstName: address.first_name,
        lastName: address.last_name,
        phone: address.phone,
        addressLine1: address.address_line1,
        addressLine2: address.address_line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
      },
      billing_address: data.useSameForBilling ? null : undefined,
      notes: data.notes,
      gst_number: data.gstNumber,
    })
    .select()
    .single();

  if (orderError) return serverErrorResponse(orderError);

  // 6. Insert order items (snapshot of product data)
  const orderItems = cart.items.map((item: any) => {
    const productData = Array.isArray(item.product) ? item.product[0] : item.product;
    const variantData = Array.isArray(item.variant) ? item.variant[0] : item.variant;

    return {
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id ?? null,
      product_name: productData?.name ?? "Unknown Product",
      product_image: productData?.images?.find((img: any) => img.is_default)?.url ?? null,
      variant_name: variantData?.name ?? null,
      variant_options: variantData?.options ?? null,
      sku: variantData?.sku ?? null,
      quantity: item.quantity,
      price: item.price,
      tax: (item.price * item.quantity * 18) / 118,
      discount: 0,
      subtotal: item.price * item.quantity,
    };
  });

  await supabase.from("order_items").insert(orderItems);

  // 7. Add initial tracking event
  await supabase.from("order_tracking").insert({
    order_id: order.id,
    status: "pending",
    title: "Order Placed",
    description: "Your order has been placed successfully",
  });

  // 8. Coupon usage tracking
  if (data.couponCode) {
    await supabase.from("coupon_usage").insert({
      coupon_id: (
        await supabase
          .from("coupons")
          .select("id")
          .eq("code", data.couponCode)
          .single()
      ).data?.id,
      user_id: user!.id,
      order_id: order.id,
      discount: couponDiscount,
    });

    await supabase.rpc("increment_coupon_usage", { coupon_code: data.couponCode });
  }

  // 9. Clear cart after order creation (for non-payment-gateway methods)
  if (data.paymentMethod === "cod") {
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    await supabase
      .from("orders")
      .update({ status: "confirmed", payment_status: "pending" })
      .eq("id", order.id);

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderId: order.id,
        orderNumber: order.order_number,
        userId: user!.id,
        total,
        items: orderItems,
      });
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }
  }

  return successResponse(
    {
      orderId: order.id,
      orderNumber: order.order_number,
      total,
      paymentMethod: data.paymentMethod,
      status: order.status,
    },
    "Order created successfully",
    201
  );
});
