import { Metadata } from "next";
import Image from "next/image";
import { Users, Truck, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | NexCart",
  description: "Learn more about NexCart, our mission, and our team.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Redefining E-Commerce for the Modern Era</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          NexCart was founded with a simple mission: to provide a seamless, secure, and delightful shopping experience for everyone. We believe in connecting people with the products they love.
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden bg-muted">
          <Image src="https://picsum.photos/seed/about1/800/800" alt="Our Office" fill className="object-cover" />
        </div>
        <div className="grid grid-rows-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden bg-muted">
            <Image src="https://picsum.photos/seed/about2/800/400" alt="Our Team" fill className="object-cover" />
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-muted">
            <Image src="https://picsum.photos/seed/about3/800/400" alt="Our Warehouse" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-card border rounded-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer First</h3>
            <p className="text-muted-foreground text-sm">Everything we do is designed to provide the best possible experience for our customers.</p>
          </div>
          <div className="p-6 bg-card border rounded-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trust & Security</h3>
            <p className="text-muted-foreground text-sm">We employ state-of-the-art security to ensure your data and transactions are safe.</p>
          </div>
          <div className="p-6 bg-card border rounded-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground text-sm">Our optimized logistics network ensures your orders reach you as quickly as possible.</p>
          </div>
          <div className="p-6 bg-card border rounded-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
            <p className="text-muted-foreground text-sm">We are committed to reducing our carbon footprint through eco-friendly practices.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary/5 border rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start shopping?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Explore our extensive catalog of premium products, curated just for you.
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/products">Explore Products</Link>
        </Button>
      </div>
    </div>
  );
}
