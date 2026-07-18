"use client";
export function PromoBanners() {
  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Electronics", subtitle: "Up to 50% off on gadgets", bg: "from-blue-600 to-indigo-700", emoji: "💻", href: "/category/electronics" },
            { title: "Fashion Week", subtitle: "New season, new styles", bg: "from-pink-500 to-rose-600", emoji: "👗", href: "/category/fashion" },
            { title: "Home Refresh", subtitle: "Transform your space", bg: "from-amber-500 to-orange-600", emoji: "🏠", href: "/category/home" },
          ].map((banner) => (
            <a key={banner.title} href={banner.href}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${banner.bg} p-6 text-white hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}>
              <p className="text-sm font-medium opacity-80">{banner.subtitle}</p>
              <h3 className="mt-1 text-xl font-bold">{banner.title}</h3>
              <span className="mt-3 inline-flex items-center text-sm font-semibold underline underline-offset-2">Shop Now →</span>
              <span className="absolute right-4 top-4 text-5xl opacity-80">{banner.emoji}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
