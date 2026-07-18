"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "home", name: "Home & Kitchen" },
  { id: "beauty", name: "Beauty & Personal Care" },
  { id: "sports", name: "Sports & Outdoors" },
];

const BRANDS = [
  { id: "apple", name: "Apple" },
  { id: "samsung", name: "Samsung" },
  { id: "nike", name: "Nike" },
  { id: "adidas", name: "Adidas" },
  { id: "sony", name: "Sony" },
];

const PRICE_RANGES = [
  { label: "Under ₹1,000", value: "0-1000" },
  { label: "₹1,000 - ₹5,000", value: "1000-5000" },
  { label: "₹5,000 - ₹10,000", value: "5000-10000" },
  { label: "₹10,000 - ₹50,000", value: "10000-50000" },
  { label: "Over ₹50,000", value: "50000+" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category");
  const currentBrands = searchParams.getAll("brand");
  const currentPrice = searchParams.get("price");

  const updateFilters = (key: string, value: string | null, isArray = false) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (isArray) {
      if (value) {
        if (params.getAll(key).includes(value)) {
          // Remove it
          const all = params.getAll(key).filter((v) => v !== value);
          params.delete(key);
          all.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      }
    } else {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    
    // Reset to page 1 on filter change
    params.delete("page");
    
    router.push(`/products?${params.toString()}`);
  };

  const clearAll = () => {
    router.push("/products");
  };

  const hasFilters = currentCategory || currentBrands.length > 0 || currentPrice;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2 text-xs text-primary">
            Clear all
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["category", "brand", "price"]} className="w-full">
        {/* Categories */}
        <AccordionItem value="category" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={currentCategory || ""}
              onValueChange={(val) => updateFilters("category", val)}
              className="flex flex-col space-y-2.5 mt-2"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="" id="cat-all" />
                <Label htmlFor="cat-all" className="text-sm font-normal cursor-pointer leading-none">All Categories</Label>
              </div>
              {CATEGORIES.map((category) => (
                <div key={category.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={category.id} id={`cat-${category.id}`} />
                  <Label htmlFor={`cat-${category.id}`} className="text-sm font-normal cursor-pointer leading-none">
                    {category.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brand" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            Brand
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-3 mt-2">
              {BRANDS.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`brand-${brand.id}`} 
                    checked={currentBrands.includes(brand.id)}
                    onCheckedChange={() => updateFilters("brand", brand.id, true)}
                  />
                  <Label htmlFor={`brand-${brand.id}`} className="text-sm font-normal cursor-pointer leading-none">
                    {brand.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={currentPrice || ""}
              onValueChange={(val) => updateFilters("price", val)}
              className="flex flex-col space-y-2.5 mt-2"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="" id="price-all" />
                <Label htmlFor="price-all" className="text-sm font-normal cursor-pointer leading-none">Any Price</Label>
              </div>
              {PRICE_RANGES.map((range) => (
                <div key={range.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={range.value} id={`price-${range.value}`} />
                  <Label htmlFor={`price-${range.value}`} className="text-sm font-normal cursor-pointer leading-none">
                    {range.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
