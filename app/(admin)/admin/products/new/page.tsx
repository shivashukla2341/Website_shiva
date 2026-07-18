"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ImagePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction } from "@/app/actions/products";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createProductAction(formData);

    if (result.success) {
      router.push("/admin/products");
    } else {
      setError(result.error || "Failed to create product");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Create a new product for your live store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
            <Input id="name" name="name" required placeholder="e.g. Sony WH-1000XM5 Headphones" />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">URL Slug</label>
            <Input id="slug" name="slug" required placeholder="e.g. sony-wh-1000xm5" />
            <p className="text-xs text-muted-foreground mt-1">The unique identifier in the web address (e.g., yourstore.com/product/slug)</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea id="description" name="description" required placeholder="Product details..." className="min-h-[120px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">Price (₹)</label>
              <Input id="price" name="price" type="number" step="0.01" required placeholder="2999" />
            </div>
            <div>
              <label htmlFor="compareAtPrice" className="block text-sm font-medium mb-1">Compare-at Price (₹)</label>
              <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" placeholder="3999 (optional)" />
              <p className="text-xs text-muted-foreground mt-1">Leave blank if no discount</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium mb-1">Category ID</label>
              <select id="categoryId" name="categoryId" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="cat-1">Electronics (cat-1)</option>
                <option value="cat-2">Fashion (cat-2)</option>
                <option value="cat-3">Home & Garden (cat-3)</option>
              </select>
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-1">Inventory Stock</label>
              <Input id="stock" name="stock" type="number" required defaultValue="10" />
            </div>
          </div>

          <div className="pt-2 border-t">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ImagePlus className="w-4 h-4 text-primary" /> Product Image
            </h3>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">Image URL</label>
              <Input id="imageUrl" name="imageUrl" type="url" required placeholder="https://example.com/image.jpg" />
              <p className="text-xs text-muted-foreground mt-1">Paste a direct link to an image (e.g. from Unsplash or Imgur) to be the cover image.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
