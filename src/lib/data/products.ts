import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

const PRODUCT_CARD_SELECT = `
  id, slug, name, base_price, compare_at_price, avg_rating, review_count,
  is_featured, is_trending, is_best_seller,
  product_media ( url, display_order )
`;

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  compare_at_price: number | null;
  avg_rating: number;
  review_count: number;
  is_featured: boolean;
  is_trending: boolean;
  is_best_seller: boolean;
  product_media: { url: string; display_order: number }[];
};

export type ProductFilters = {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: "relevance" | "price_asc" | "price_desc" | "newest" | "rating";
  page?: number;
  pageSize?: number;
};

export async function listProducts(filters: ProductFilters = {}) {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT, { count: "exact" })
    .eq("status", "active");

  if (filters.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.categorySlug)
      .single();
    if (category) query = query.eq("category_id", category.id);
  }

  if (filters.brandSlug) {
    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", filters.brandSlug)
      .single();
    if (brand) query = query.eq("brand_id", brand.id);
  }

  if (filters.search) {
    query = query.textSearch("search_vector", filters.search, {
      type: "websearch",
      config: "english",
    });
  }

  if (filters.minPrice !== undefined) query = query.gte("base_price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("base_price", filters.maxPrice);
  if (filters.minRating !== undefined) query = query.gte("avg_rating", filters.minRating);

  switch (filters.sort) {
    case "price_asc":
      query = query.order("base_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("base_price", { ascending: false });
      break;
    case "newest":
      query = query.order("published_at", { ascending: false });
      break;
    case "rating":
      query = query.order("avg_rating", { ascending: false });
      break;
    default:
      query = query.order("sold_count", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    products: (data ?? []) as unknown as ProductListItem[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export type ProductDetailVariant = {
  id: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  is_default: boolean;
  image_url: string | null;
  is_active: boolean;
  product_variant_attributes: {
    attribute_values: {
      id: string;
      value: string;
      display_value: string;
      hex_color: string | null;
      attributes: { id: string; name: string; display_name: string };
    };
  }[];
};

export type ProductDetail = Tables<"products"> & {
  brands: { id: string; name: string; slug: string; logo_url: string | null } | null;
  categories: { id: string; name: string; slug: string } | null;
  product_media: { id: string; url: string; media_type: string; alt_text: string | null; display_order: number }[];
  product_variants: ProductDetailVariant[];
};

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `*, brands ( id, name, slug, logo_url ), categories ( id, name, slug ),
       product_media ( id, url, media_type, alt_text, display_order ),
       product_variants (
         id, sku, price, compare_at_price, stock_quantity, is_default, image_url, is_active,
         product_variant_attributes (
           attribute_values ( id, value, display_value, hex_color, attributes ( id, name, display_name ) )
         )
       )`
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductDetail | null;
}

export async function getRelatedProducts(categoryId: string | null, excludeProductId: string) {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("category_id", categoryId)
    .eq("status", "active")
    .neq("id", excludeProductId)
    .limit(8);

  return (data ?? []) as unknown as ProductListItem[];
}

export type ProductReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  review_images: { url: string }[];
};

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select(
      `id, rating, title, body, is_verified_purchase, helpful_count, created_at,
       profiles ( full_name, avatar_url ), review_images ( url )`
    )
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []) as unknown as ProductReview[];
}

export type ProductQuestion = {
  id: string;
  question: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
  product_answers: {
    id: string;
    answer: string;
    is_seller_answer: boolean;
    created_at: string;
    profiles: { full_name: string | null } | null;
  }[];
};

export async function getProductQuestions(productId: string): Promise<ProductQuestion[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_questions")
    .select(
      `id, question, created_at, profiles ( full_name ),
       product_answers ( id, answer, is_seller_answer, created_at, profiles ( full_name ) )`
    )
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []) as unknown as ProductQuestion[];
}

export async function listCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, parent_id, display_order")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data;
}

export async function listBrands() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url")
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}

export async function getBrandBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data;
}

export type ActiveFlashSale = {
  id: string;
  name: string;
  ends_at: string;
  flash_sale_products: {
    sale_price: number;
    products: {
      id: string;
      slug: string;
      name: string;
      base_price: number;
      avg_rating: number;
      review_count: number;
      product_media: { url: string; display_order: number }[];
    };
  }[];
};

export async function listFlashSaleProducts(): Promise<ActiveFlashSale | null> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("flash_sales")
    .select(
      `id, name, ends_at,
       flash_sale_products ( sale_price, products ( id, slug, name, base_price, avg_rating, review_count, product_media ( url, display_order ) ) )`
    )
    .eq("is_active", true)
    .lte("starts_at", nowIso)
    .gte("ends_at", nowIso)
    .order("ends_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data as unknown as ActiveFlashSale | null;
}
