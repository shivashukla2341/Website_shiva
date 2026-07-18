"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProductAction(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const compareAtPriceStr = formData.get("compareAtPrice") as string;
  const compareAtPrice = compareAtPriceStr ? parseFloat(compareAtPriceStr) : null;
  const categoryId = formData.get("categoryId") as string;
  const stock = parseInt(formData.get("stock") as string, 10);
  const imageUrl = formData.get("imageUrl") as string;
  
  const images = [{ url: imageUrl, isDefault: true }];

  const newProduct = {
    name,
    slug,
    description,
    price,
    compare_at_price: compareAtPrice,
    category_id: categoryId,
    stock,
    images,
    status: 'active',
  };

  const { error } = await supabase.from("products").insert(newProduct);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");

  return { success: true };
}
