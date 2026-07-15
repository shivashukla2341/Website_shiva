"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { mainNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled
          ? "glass-panel shadow-soft"
          : "border-b border-transparent bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-gradient-brand text-xl font-bold">
                {siteConfig.name}
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1 px-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="bg-gradient-brand flex size-9 items-center justify-center rounded-xl font-bold text-white shadow-soft">
            {siteConfig.name.charAt(0)}
          </span>
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands and more..."
              className="rounded-full bg-muted/50 pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/search" aria-label="Search">
              <Search className="size-5" />
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/wishlist" aria-label="Wishlist">
              <Heart className="size-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 size-4 justify-center rounded-full p-0 text-[10px]">
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart" aria-label="Cart">
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 size-4 justify-center rounded-full p-0 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account" aria-label="Account">
              <User className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
