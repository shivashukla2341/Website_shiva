// =============================================================================
// NEXCART — PRODUCTS API
// GET /api/products — List with filtering, sorting, pagination
// POST /api/products — Create (admin)
// =============================================================================

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  getPaginationParams,
  buildPaginatedResponse,
  requireAdminUser,
  withErrorHandling,
  validateBody,
} from "@/lib/api/helpers";
import { productSchema } from "@/lib/validators";
import { generateSlug } from "@/lib/api/helpers";
import { applyRateLimit, rateLimiters } from "@/lib/rate-limit";

// ─── GET /api/products ───────────────────────────────────────────────────────
export const GET = withErrorHandling(async (request: NextRequest) => {
  // Rate limit
  const limited = await applyRateLimit(request, rateLimiters.api);
  if (limited) return limited;

  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  const { page, limit, offset } = getPaginationParams(searchParams);

  // Filters
  const search = searchParams.get("search")?.trim();
  const categoryId = searchParams.get("categoryId");
  const categorySlug = searchParams.get("category");
  const brandIds = searchParams.getAll("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const inStock = searchParams.get("inStock");
  const isFeatured = searchParams.get("featured");
  const isTrending = searchParams.get("trending");
  const isBestSeller = searchParams.get("bestSeller");
  const isNewArrival = searchParams.get("newArrival");
  const sortBy = searchParams.get("sort") ?? "newest";
  const tags = searchParams.getAll("tag");
  const status = searchParams.get("status") ?? "active";

  let query = supabase
    .from("products")
    .select(
      `
      id, slug, name, short_description, price, compare_at_price,
      average_rating, review_count, has_variants, is_featured,
      is_trending, is_best_seller, is_new_arrival, status, tags,
      brand:brands(id, name, slug),
      category:categories(id, name, slug),
      images:product_images(id, url, alt_text, sort_order, is_default),
      inventory_status:inventory_status(in_stock, is_low_stock)
    `,
      { count: "exact" }
    )
    .eq("status", status)
    .order("created_at", { ascending: false });

  // Full-text search
  if (search) {
    query = query.textSearch("search_vector", search, {
      type: "websearch",
      config: "english",
    });
  }

  // Category filter
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  } else if (categorySlug) {
    // Subquery via RPC
    query = query.eq("category.slug", categorySlug);
  }

  // Brand filter
  if (brandIds.length > 0) {
    query = query.in("brand_id", brandIds);
  }

  // Price range
  if (minPrice) query = query.gte("price", Number(minPrice));
  if (maxPrice) query = query.lte("price", Number(maxPrice));

  // Rating filter
  if (minRating) query = query.gte("average_rating", Number(minRating));

  // Boolean filters
  if (isFeatured === "true") query = query.eq("is_featured", true);
  if (isTrending === "true") query = query.eq("is_trending", true);
  if (isBestSeller === "true") query = query.eq("is_best_seller", true);
  if (isNewArrival === "true") query = query.eq("is_new_arrival", true);

  // Tag filter
  if (tags.length > 0) query = query.overlaps("tags", tags);

  // Sorting
  switch (sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("average_rating", { ascending: false });
      break;
    case "popular":
      query = query.order("view_count", { ascending: false });
      break;
    case "best_seller":
      query = query.order("sold_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data: products, error, count } = await query;

  if (error) return serverErrorResponse(error);

  return successResponse(
    buildPaginatedResponse(products ?? [], count ?? 0, page, limit)
  );
});

// ─── POST /api/products ──────────────────────────────────────────────────────
export const POST = withErrorHandling(async (request: NextRequest) => {
  const limited = await applyRateLimit(request, rateLimiters.admin, "admin");
  if (limited) return limited;

  const { error: authError } = await requireAdminUser();
  if (authError) return authError;

  const validation = await validateBody(request, productSchema);
  if ("error" in validation) return validation.error;

  const { data } = validation;
  const supabase = await createClient();

  // Generate slug
  let slug = generateSlug(data.name);
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  // Insert base product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name: data.name,
      slug,
      short_description: data.shortDescription,
      description: data.description,
      category_id: data.categoryId,
      brand_id: data.brandId || null,
      tags: data.tags,
      status: data.status,
      is_featured: data.isFeatured,
      is_trending: data.isTrending,
      is_best_seller: data.isBestSeller,
      is_new_arrival: data.isNewArrival,
      price: data.variants[0].price,
      compare_at_price: data.variants[0].compareAtPrice,
      tax_rate: data.taxRate,
      tax_inclusive: data.taxInclusive,
      has_variants: data.hasVariants || data.variants.length > 1,
      meta_title: data.metaTitle,
      meta_description: data.metaDescription,
      meta_keywords: data.metaKeywords,
    })
    .select()
    .single();

  if (productError) return serverErrorResponse(productError);

  // Insert variants
  const variantsToInsert = data.variants.map((v) => ({
    product_id: product.id,
    sku: v.sku,
    barcode: v.barcode,
    name: v.name,
    options: v.options,
    price: v.price,
    compare_at_price: v.compareAtPrice,
    cost_price: v.costPrice,
    weight: v.weight,
    weight_unit: v.weightUnit,
    image_url: v.imageUrl,
    is_active: v.isActive,
  }));

  const { data: variants, error: variantError } = await supabase
    .from("product_variants")
    .insert(variantsToInsert)
    .select();

  if (variantError) return serverErrorResponse(variantError);

  // Insert inventory for each variant
  await supabase.from("inventory").insert(
    variants!.map((v, i) => ({
      variant_id: v.id,
      product_id: product.id,
      quantity: data.variants[i].quantity ?? 0,
      low_stock_threshold: data.variants[i].lowStockThreshold ?? 5,
      track_inventory: data.variants[i].trackInventory ?? true,
      allow_backorder: data.variants[i].allowBackorder ?? false,
    }))
  );

  return successResponse(
    { ...product, variants },
    "Product created successfully",
    201
  );
});
