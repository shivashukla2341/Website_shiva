"use server";

import { createClient } from "@/lib/supabase/server";
import { getCart } from "./cart";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data;
}

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Must be logged in");

  const cart = await getCart();
  if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calculate total
  const total = cart.cart_items.reduce((acc: number, item: any) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  // 1. Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: total,
      status: "pending",
      payment_method: formData.get("paymentMethod") as string,
      shipping_address_id: formData.get("addressId") as string,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order items
  const orderItems = cart.cart_items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_time: item.product.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // 3. Clear cart
  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  revalidatePath("/cart");
  revalidatePath("/account/orders");
  redirect(`/account/orders/${order.id}`);
}
