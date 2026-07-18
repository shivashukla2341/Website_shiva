"use client";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Fashion Blogger", rating: 5, text: "NexCart has completely transformed my shopping experience. The product quality is outstanding and delivery is always on time!", avatar: "👩‍💼" },
  { name: "Rahul Gupta", role: "Tech Enthusiast", rating: 5, text: "Amazing selection of electronics at the best prices. The AI recommendations are spot-on — it knows exactly what I need!", avatar: "👨‍💻" },
  { name: "Anjali Singh", role: "Home Decor Lover", rating: 5, text: "Super easy to shop, great customer service, and hassle-free returns. I've been shopping here for 2 years and never disappointed!", avatar: "👩‍🎨" },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary">Reviews</p>
          <h2 className="section-heading">What Our Customers Say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="relative rounded-2xl border border-border bg-card p-6 hover:shadow-soft-md transition-shadow">
              <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.avatar}</span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
