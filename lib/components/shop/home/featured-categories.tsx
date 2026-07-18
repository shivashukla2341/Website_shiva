"use client";

// =============================================================================
// NEXCART — FEATURED CATEGORIES
// Animated category grid with hover effects
// =============================================================================

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Car,
  Dumbbell,
  BookOpen,
  Baby,
  Utensils,
  Headphones,
  Watch,
  Camera,
} from "lucide-react";

const CATEGORIES = [
  { name: "Electronics", icon: Smartphone, href: "/category/electronics", color: "from-blue-500 to-indigo-600", count: "12K+ items" },
  { name: "Fashion", icon: Shirt, href: "/category/fashion", color: "from-pink-500 to-rose-600", count: "45K+ items" },
  { name: "Home & Living", icon: Home, href: "/category/home", color: "from-amber-500 to-orange-600", count: "8K+ items" },
  { name: "Beauty", icon: Sparkles, href: "/category/beauty", color: "from-purple-500 to-violet-600", count: "15K+ items" },
  { name: "Automotive", icon: Car, href: "/category/automotive", color: "from-slate-500 to-gray-700", count: "3K+ items" },
  { name: "Sports", icon: Dumbbell, href: "/category/sports", color: "from-green-500 to-emerald-600", count: "6K+ items" },
  { name: "Books", icon: BookOpen, href: "/category/books", color: "from-teal-500 to-cyan-600", count: "20K+ items" },
  { name: "Baby & Kids", icon: Baby, href: "/category/baby", color: "from-yellow-500 to-amber-600", count: "4K+ items" },
  { name: "Food & Grocery", icon: Utensils, href: "/category/grocery", color: "from-lime-500 to-green-600", count: "10K+ items" },
  { name: "Audio", icon: Headphones, href: "/category/audio", color: "from-violet-500 to-purple-700", count: "2K+ items" },
  { name: "Watches", icon: Watch, href: "/category/watches", color: "from-rose-500 to-red-600", count: "3K+ items" },
  { name: "Cameras", icon: Camera, href: "/category/cameras", color: "from-sky-500 to-blue-600", count: "1.5K+ items" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function FeaturedCategories() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Browse
          </p>
          <h2 className="section-heading">Shop by Category</h2>
          <p className="mt-3 text-muted-foreground">
            Find exactly what you&apos;re looking for
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.name} variants={cardVariants as any}>
              <Link href={cat.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md group-hover:border-primary/30">
                  {/* Icon container */}
                  <div
                    className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} shadow-soft`}
                  >
                    <cat.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {cat.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {cat.count}
                  </p>

                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <div className="mt-8 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
