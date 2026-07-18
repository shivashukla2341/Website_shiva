"use client";

// =============================================================================
// NEXCART — HERO SECTION
// Full-screen hero with animated gradient, Swiper carousel, CTAs
// =============================================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, Star, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HERO_SLIDES = [
  {
    id: 1,
    badge: "New Collection",
    title: "Experience Premium",
    highlight: "Shopping",
    subtitle:
      "Discover millions of products from top brands at unbeatable prices with lightning-fast delivery.",
    cta: { label: "Shop Now", href: "/products" },
    secondaryCta: { label: "View Offers", href: "/offers" },
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    accentColor: "hsl(252, 75%, 62%)",
    stats: [
      { label: "Products", value: "1M+" },
      { label: "Brands", value: "500+" },
      { label: "Happy Customers", value: "2M+" },
    ],
    image: "🛍️",
  },
  {
    id: 2,
    badge: "Flash Sale",
    title: "Up to 70% Off",
    highlight: "Top Brands",
    subtitle:
      "Exclusive deals on electronics, fashion, and more. Limited time offer — grab before it's gone!",
    cta: { label: "Grab Deals", href: "/offers" },
    secondaryCta: { label: "All Products", href: "/products" },
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    accentColor: "hsl(14, 89%, 55%)",
    stats: [
      { label: "Deals Active", value: "500+" },
      { label: "Max Savings", value: "70%" },
      { label: "Brands on Sale", value: "100+" },
    ],
    image: "⚡",
  },
  {
    id: 3,
    badge: "Trending Now",
    title: "Discover What's",
    highlight: "Hot Right Now",
    subtitle:
      "Stay ahead with the latest trends. AI-powered recommendations tailored just for you.",
    cta: { label: "Explore Trending", href: "/products?filter=trending" },
    secondaryCta: { label: "AI Picks", href: "/products?ai=true" },
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    accentColor: "hsl(160, 60%, 45%)",
    stats: [
      { label: "Trending Items", value: "10K+" },
      { label: "Daily Updates", value: "24/7" },
      { label: "AI Powered", value: "100%" },
    ],
    image: "🚀",
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <section className="hero-section overflow-hidden">
      {/* Animated gradient background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-10 dark:opacity-20`}
        />
      </AnimatePresence>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 h-72 w-72 rounded-full opacity-10 dark:opacity-15"
          style={{ background: `radial-gradient(circle, ${slide.accentColor}, transparent)` }}
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-20 h-56 w-56 rounded-full opacity-10 dark:opacity-15"
          style={{ background: `radial-gradient(circle, ${slide.accentColor}, transparent)` }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at center, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col gap-6"
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <Badge className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold gradient-bg text-white rounded-full border-0">
                  <Zap className="h-3 w-3" />
                  {slide.badge}
                </Badge>
              </motion.div>

              {/* Heading */}
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                  {slide.title}{" "}
                  <span className="gradient-text">{slide.highlight}</span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-lg text-muted-foreground max-w-lg leading-relaxed"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-3"
              >
                <Link href={slide.cta.href} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8 text-base shadow-soft hover:shadow-soft-md hover:-translate-y-1 transition-all gradient-bg text-white font-medium">
                  {slide.cta.label}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href={slide.secondaryCta.href} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-8 text-base hover:-translate-y-1 transition-all hover:bg-muted hover:text-foreground font-medium">
                  {slide.secondaryCta.label}
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-4 pt-4"
              >
                {slide.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Social proof */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 pt-2"
              >
                <div className="flex -space-x-2">
                  {["👨", "👩", "👨‍💼", "👩‍💼", "🧑"].map((emoji, i) => (
                    <span
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-sm"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-1 text-sm font-semibold">4.9</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Trusted by 2M+ customers
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Visual */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Main card */}
              <div
                className={`relative flex h-80 w-80 xl:h-96 xl:w-96 items-center justify-center rounded-3xl bg-gradient-to-br ${slide.gradient} shadow-2xl`}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-9xl xl:text-[10rem]"
                >
                  {slide.image}
                </motion.span>

                {/* Floating feature cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 glass-card px-4 py-3 min-w-[140px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Sales Today</p>
                      <p className="text-xs text-muted-foreground">+32% growth</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-6 -left-6 glass-card px-4 py-3 min-w-[140px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <Star className="h-4 w-4 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Rating</p>
                      <p className="text-xs text-muted-foreground">4.9 / 5.0</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeSlide
                  ? "w-8 gradient-bg"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-background"
        style={{
          clipPath: "ellipse(70% 100% at 50% 100%)",
        }}
      />
    </section>
  );
}
