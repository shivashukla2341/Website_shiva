import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Star } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ReviewsSection } from "@/components/product/reviews-section";
import { QnaSection } from "@/components/product/qna-section";
import { ProductRail } from "@/components/home/product-rail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toProductCardData } from "@/lib/data/mappers";
import {
  getProductBySlug,
  getProductQuestions,
  getProductReviews,
  getRelatedProducts,
} from "@/lib/data/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.meta_title ?? product.name,
    description: product.meta_description ?? product.short_description ?? undefined,
    openGraph: {
      images: product.product_media[0] ? [{ url: product.product_media[0].url }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, questions, related] = await Promise.all([
    getProductReviews(product.id),
    getProductQuestions(product.id),
    getRelatedProducts(product.category_id, product.id),
  ]);

  const sortedMedia = [...product.product_media].sort((a, b) => a.display_order - b.display_order);
  const fallbackImage =
    sortedMedia[0]?.url ?? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.description,
    image: sortedMedia.map((m) => m.url),
    brand: product.brands ? { "@type": "Brand", name: product.brands.name } : undefined,
    aggregateRating:
      product.review_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.avg_rating,
            reviewCount: product.review_count,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.base_price,
      availability: product.product_variants.some((v) => v.stock_quantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          ...(product.categories
            ? [{ label: product.categories.name, href: `/category/${product.categories.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <ProductGallery media={sortedMedia} productName={product.name} />

        <div>
          {product.brands && (
            <Link
              href={`/brand/${product.brands.slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {product.brands.name}
            </Link>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{product.avg_rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">
              ({product.review_count.toLocaleString("en-IN")} ratings)
            </span>
          </div>
          {product.short_description && (
            <p className="mt-3 text-sm text-muted-foreground">{product.short_description}</p>
          )}

          <div className="mt-6">
            <ProductBuyBox
              productId={product.id}
              productSlug={product.slug}
              productName={product.name}
              fallbackImage={fallbackImage}
              variants={product.product_variants}
            />
          </div>
        </div>
      </div>

      <div className="mt-14">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.review_count})</TabsTrigger>
            <TabsTrigger value="qna">Questions &amp; Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-6">
            <div className="max-w-3xl text-sm whitespace-pre-line text-muted-foreground">
              {product.description ?? "No description available."}
            </div>
            {product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            <ReviewsSection
              reviews={reviews}
              avgRating={product.avg_rating}
              reviewCount={product.review_count}
            />
          </TabsContent>
          <TabsContent value="qna" className="pt-6">
            <QnaSection questions={questions} />
          </TabsContent>
        </Tabs>
      </div>

      {related.length > 0 && (
        <div className="mt-14 -mx-4 sm:-mx-6 lg:-mx-8">
          <ProductRail title="You may also like" products={related.map(toProductCardData)} />
        </div>
      )}
    </div>
  );
}
