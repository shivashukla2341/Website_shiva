"use client";

// =============================================================================
// NEXCART — MAIN NAVBAR
// Premium glassmorphism navigation with megamenu, search, cart badge
// =============================================================================

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  LayoutDashboard,
  Mic,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Shop",
    href: "/products",
    megamenu: [
      {
        title: "Electronics",
        items: ["Smartphones", "Laptops", "Headphones", "Cameras", "Tablets"],
        href: "/category/electronics",
      },
      {
        title: "Fashion",
        items: ["Men's Clothing", "Women's Clothing", "Footwear", "Accessories", "Watches"],
        href: "/category/fashion",
      },
      {
        title: "Home & Living",
        items: ["Furniture", "Kitchen", "Bedding", "Lighting", "Decor"],
        href: "/category/home",
      },
      {
        title: "Beauty",
        items: ["Skincare", "Makeup", "Haircare", "Perfumes", "Grooming"],
        href: "/category/beauty",
      },
    ],
  },
  { label: "Brands", href: "/brands" },
  { label: "Offers", href: "/offers" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { itemCount, setOpen: openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* ── Announcement Bar ──────────────────────────────────────────── */}
      <div className="bg-primary py-2 text-center text-xs font-medium text-primary-foreground">
        🎉 Free shipping on orders above ₹499 &nbsp;|&nbsp; Use code{" "}
        <strong>FIRST10</strong> for 10% off your first order
        <Link href="/offers" className="ml-2 underline underline-offset-2">
          View All Offers →
        </Link>
      </div>

      {/* ── Main Navbar ───────────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "glass border-b border-glass-border shadow-glass"
            : "border-b border-transparent bg-background/80 backdrop-blur-md"
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-2xl font-bold"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg text-white text-sm font-black">
              N
            </div>
            <span className="gradient-text">NexCart</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.megamenu && setActiveMegaMenu(item.label)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "nav-link",
                    pathname.startsWith(item.href) && "active"
                  )}
                >
                  {item.label}
                  {item.megamenu && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        activeMegaMenu === item.label && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                {/* Megamenu */}
                {item.megamenu && (
                  <AnimatePresence>
                    {activeMegaMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full z-50 mt-1 w-[720px] glass-card p-6"
                      >
                        <div className="grid grid-cols-4 gap-6">
                          {item.megamenu.map((section) => (
                            <div key={section.title}>
                              <Link
                                href={section.href}
                                className="mb-2 block text-sm font-semibold text-foreground hover:text-primary transition-colors"
                              >
                                {section.title}
                              </Link>
                              <ul className="space-y-1">
                                {section.items.map((subItem) => (
                                  <li key={subItem}>
                                    <Link
                                      href={`${section.href}/${subItem.toLowerCase().replace(/\s+/g, "-")}`}
                                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      {subItem}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden flex-1 max-w-xs lg:max-w-md xl:max-w-lg lg:flex">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="h-10 w-full rounded-xl border-border bg-muted/50 pl-10 pr-10 text-sm focus-visible:ring-primary"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                title="Voice search"
              >
                <Mic className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search (mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative rounded-xl">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl"
              onClick={() => openCart(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-xl" />}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="gradient-bg text-white text-xs font-bold">
                    U
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card border-glass-border">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard" className="cursor-pointer" />}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/orders" className="cursor-pointer" />}>
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/notifications" className="cursor-pointer" />}>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/settings" className="cursor-pointer" />}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/login" className="cursor-pointer text-red-500 focus:text-red-500" />}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden rounded-xl" />}>
                  <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="glass w-72 border-glass-border">
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg text-white font-black">
                    N
                  </div>
                  <span className="font-display text-xl font-bold gradient-text">NexCart</span>
                </div>
                <nav className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "nav-link justify-between",
                        pathname.startsWith(item.href) && "active"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto pt-8 border-t border-border">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full gradient-bg hover:opacity-90">
                      <User className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Drawer */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border px-4 py-3 lg:hidden"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  className="h-10 w-full rounded-xl pl-10 pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
