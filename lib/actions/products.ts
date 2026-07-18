"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProducts(options?: { 
  category?: string; 
  brand?: string; 
  search?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  let query = supabase.from("products").select("*, category:categories(*), brand:brands(*)").eq("is_active", true);

  if (options?.category) {
    query = query.eq("category_id", options.category);
  }
  if (options?.brand) {
    query = query.eq("brand_id", options.brand);
  }
  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  return data;
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), brand:brands(*), variants:product_variants(*), images:product_images(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }

  return data;
}
