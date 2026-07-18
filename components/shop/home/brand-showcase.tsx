"use client";
import Image from "next/image";
import Link from "next/link";

const BRANDS = [
  { name: "Apple", logo: "🍎", href: "/brand/apple" },
  { name: "Samsung", logo: "📱", href: "/brand/samsung" },
  { name: "Nike", logo: "👟", href: "/brand/nike" },
  { name: "Sony", logo: "🎵", href: "/brand/sony" },
  { name: "Adidas", logo: "🏃", href: "/brand/adidas" },
  { name: "LG", logo: "📺", href: "/brand/lg" },
  { name: "Bose", logo: "🎧", href: "/brand/bose" },
  { name: "Dell", logo: "💻", href: "/brand/dell" },
];

export function BrandShowcase() {
  return (
    <section className="py-14 border-y border-border bg-muted/20">
      <div className="container mx-auto px-4">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted Brands
        </p>
        <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
          {BRANDS.map((brand) => (
            <Link key={brand.name} href={brand.href}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-soft hover:-translate-y-0.5">
              <span className="text-3xl">{brand.logo}</span>
              <span className="text-[11px] font-medium text-muted-foreground">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
