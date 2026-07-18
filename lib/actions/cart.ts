"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("carts")
    .select("*, cart_items(*, product:products(*))")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 is no rows returned
    console.error("Error fetching cart:", error);
    return null;
  }

  return data;
}

export async function addToCart(productId: string, quantity: number = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Must be logged in to add to cart");
  }

  // 1. Get or create cart
  let cart = await getCart();
  
  if (!cart) {
    const { data: newCart, error: cartError } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select()
      .single();
      
    if (cartError) throw cartError;
    cart = newCart;
  }

  // 2. Check if item exists in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    // Update quantity
    await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id);
  } else {
    // Insert new item
    await supabase
      .from("cart_items")
      .insert({
        cart_id: cart.id,
        product_id: productId,
        quantity: quantity
      });
  }

  revalidatePath("/cart");
  return { success: true };
}
