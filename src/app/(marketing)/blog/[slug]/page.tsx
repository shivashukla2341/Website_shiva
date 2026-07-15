import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getBlogPostBySlug } from "@/lib/data/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    openGraph: post.cover_image_url ? { images: [{ url: post.cover_image_url }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <h1 className="mt-4 text-3xl font-bold tracking-tight">{post.title}</h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        {post.profiles?.full_name && <span>{post.profiles.full_name}</span>}
        {post.published_at && (
          <>
            <span>&middot;</span>
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </>
        )}
      </div>

      {post.cover_image_url && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl bg-muted">
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none whitespace-pre-line">
        {post.content}
      </div>
    </article>
  );
}
