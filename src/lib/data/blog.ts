import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  blog_categories: { name: string; slug: string } | null;
};

export async function listBlogPosts(page = 1, pageSize = 9) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, cover_image_url, published_at, blog_categories ( name, slug )",
      { count: "exact" }
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  return {
    posts: (data ?? []) as unknown as BlogPostListItem[],
    total: count ?? 0,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export type BlogPostDetail = Tables<"blog_posts"> & {
  blog_categories: { name: string; slug: string } | null;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
};

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*, blog_categories ( name, slug ), profiles ( full_name, avatar_url )")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return data as unknown as BlogPostDetail | null;
}
