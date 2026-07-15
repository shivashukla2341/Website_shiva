import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { listBlogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Product guides, style tips, and stories from the team.",
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80";

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = sp.page ? Number(sp.page) : 1;
  const { posts, totalPages } = await listBlogPosts(page);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <h1 className="mt-4 mb-8 text-3xl font-bold tracking-tight">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts published yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={post.cover_image_url ?? FALLBACK_IMAGE}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                {post.blog_categories && (
                  <span className="text-xs font-semibold text-primary">{post.blog_categories.name}</span>
                )}
                <h2 className="mt-1 line-clamp-2 font-semibold">{post.title}</h2>
                {post.excerpt && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <PaginationControls page={page} totalPages={totalPages} basePath="/blog" searchParams={sp} />
    </div>
  );
}
