// =============================================================================
// NEXCART — DYNAMIC SITEMAP
// =============================================================================

import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${APP_URL}/products`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${APP_URL}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${APP_URL}/offers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${APP_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${APP_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    { url: `${APP_URL}/affiliate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${APP_URL}/become-seller`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${APP_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${APP_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${APP_URL}/shipping-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${APP_URL}/refund-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic product pages
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("status", "active")
    .limit(5000);

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p: any) => ({
    url: `${APP_URL}/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Dynamic category pages
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at")
    .eq("is_active", true);

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c: any) => ({
    url: `${APP_URL}/category/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  // Dynamic blog pages
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published");

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((p: any) => ({
    url: `${APP_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages];
}
