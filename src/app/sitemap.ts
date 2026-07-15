import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

// Static routes today; extended with dynamic product/category/brand/blog
// URLs (pulled from Supabase) once the data layer lands in later steps.
const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/faq",
  "/privacy-policy",
  "/terms",
  "/shipping-policy",
  "/refund-policy",
  "/careers",
  "/become-seller",
  "/affiliate-program",
  "/blog",
  "/offers",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
