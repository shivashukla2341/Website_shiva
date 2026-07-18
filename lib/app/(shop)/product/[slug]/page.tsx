import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, RotateCcw, Share2, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { ProductRecommendations } from "@/components/shop/product-recommendations";

// Mock Product Data
const MOCK_PRODUCT = {
  id: "prod-1",
  name: "Apple iPhone 15 Pro Max (256GB) - Natural Titanium",
  slug: "apple-iphone-15-pro-max",
  brand: { name: "Apple", slug: "apple" },
  category: { name: "Smartphones", slug: "smartphones" },
  price: 159900,
  compareAtPrice: 169900,
  shortDescription: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
  description: "<p>The iPhone 15 Pro Max features an aerospace-grade titanium design that's strong and light...</p>",
  averageRating: 4.8,
  reviewCount: 1245,
  inStock: true,
  images: [
    { url: "https://picsum.photos/seed/iphone1/800/800", isDefault: true },
    { url: "https://picsum.photos/seed/iphone2/800/800", isDefault: false },
    { url: "https://picsum.photos/seed/iphone3/800/800", isDefault: false },
  ],
  variants: [
    { id: "v1", options: { color: "Natural Titanium", storage: "256GB" }, price: 159900 },
    { id: "v2", options: { color: "Blue Titanium", storage: "256GB" }, price: 159900 },
    { id: "v3", options: { color: "Natural Titanium", storage: "512GB" }, price: 179900 },
  ],
  features: [
    "A17 Pro chip with 6-core GPU",
    "Titanium with textured matte glass back",
    "Action button",
    "Dynamic Island",
    "Pro camera system (48MP Main, 12MP Ultra Wide, and 12MP Telephoto)",
    "USB-C connector with USB 3",
  ]
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | NexCart`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Normally fetch from DB using slug
  // const supabase = await createClient();
  // const { data: product } = await supabase.from('products').select('*, brand(*), category(*)').eq('slug', slug).single();
  
  const product = MOCK_PRODUCT;

  if (!product) {
    notFound();
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2 mt-0.5 flex-shrink-0" />
        <Link href={`/category/${product.category.slug}`} className="hover:text-primary transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 mt-0.5 flex-shrink-0" />
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-full">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 flex-shrink-0 pb-2 md:pb-0 scrollbar-hide">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                className={`relative aspect-square w-20 md:w-full rounded-md overflow-hidden border-2 transition-all ${i === 0 ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
              >
                <Image src={img.url} alt={`${product.name} - image ${i+1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
          <div className="relative aspect-square md:aspect-[4/5] w-full rounded-xl overflow-hidden bg-muted">
            <Image src={product.images[0].url} alt={product.name} fill className="object-cover" priority />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 text-sm px-2.5 py-0.5 bg-red-500 hover:bg-red-600 border-none">
                {discount}% OFF
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Link href={`/brand/${product.brand.slug}`} className="text-primary font-medium text-sm hover:underline mb-2">
            {product.brand.name}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(product.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                />
              ))}
              <span className="ml-2 text-sm font-medium">{product.averageRating}</span>
              <span className="ml-1 text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-green-600 font-medium flex items-center">
              <ShieldCheck className="h-4 w-4 mr-1" /> Assured
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Inclusive of all taxes</p>
          </div>

          <Separator className="mb-6" />

          {/* Variants Selection (Mocked UI) */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-sm font-medium mb-3">Color: <span className="text-muted-foreground">Natural Titanium</span></h3>
              <div className="flex flex-wrap gap-3">
                <button className="h-10 px-4 rounded-md border-2 border-primary bg-background text-sm font-medium">Natural Titanium</button>
                <button className="h-10 px-4 rounded-md border bg-muted/50 text-sm font-medium hover:border-primary/50 transition-colors">Blue Titanium</button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Storage</h3>
              <div className="flex flex-wrap gap-3">
                <button className="h-10 px-4 rounded-md border-2 border-primary bg-background text-sm font-medium">256GB</button>
                <button className="h-10 px-4 rounded-md border bg-muted/50 text-sm font-medium hover:border-primary/50 transition-colors">512GB</button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="flex-1 h-12 text-base font-semibold">
              Add to Cart
            </Button>
            <Button size="lg" variant="secondary" className="flex-1 h-12 text-base font-semibold gradient-bg text-white hover:opacity-90">
              Buy Now
            </Button>
          </div>

          {/* Features / Highlights */}
          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-base">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <RotateCcw className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">7 Days Return</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      <ProductRecommendations currentProductId={product.id} category={product.category} />

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full mt-12">
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none mb-8">
          <TabsTrigger value="description" className="text-base py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
            Description
          </TabsTrigger>
          <TabsTrigger value="specifications" className="text-base py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
            Specifications
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-base py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
            Reviews ({product.reviewCount})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {product.shortDescription}
          </p>
          <div className="mt-6 text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.description }} />
        </TabsContent>
        <TabsContent value="specifications">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">General</h3>
              <div className="grid grid-cols-3 py-2 border-b text-sm">
                <span className="text-muted-foreground">Brand</span>
                <span className="col-span-2 font-medium">{product.brand.name}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b text-sm">
                <span className="text-muted-foreground">Model Name</span>
                <span className="col-span-2 font-medium">iPhone 15 Pro Max</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b text-sm">
                <span className="text-muted-foreground">Color</span>
                <span className="col-span-2 font-medium">Natural Titanium</span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold">{product.averageRating}</span>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < 4 ? 'fill-yellow-400' : ''}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">Based on {product.reviewCount} reviews</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">Write a Review</Button>
            </div>
            <div className="w-full md:w-2/3 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pb-6 border-b">
                  <div className="flex justify-between mb-2">
                    <div className="flex gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-400" />)}
                      </div>
                      <span className="font-semibold text-sm">Amazing Product!</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Absolutely love this phone. The titanium finish is beautiful and it feels so much lighter than previous models. The camera is outstanding.
                  </p>
                  <span className="text-xs font-medium text-green-600 mt-2 block">Verified Purchase</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
