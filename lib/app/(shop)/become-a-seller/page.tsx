import { Metadata } from "next";
import { Store, ShieldCheck, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sell on NexCart | NexCart",
  description: "Become a seller on NexCart and reach millions of customers.",
};

export default function BecomeSellerPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-24">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Take your business to the next level</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Join thousands of successful sellers on NexCart. Get access to our vast customer base, advanced seller tools, and reliable logistics network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-semibold">Start Selling</Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted border">
          {/* Placeholder for hero image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center">
            <Store className="w-32 h-32 text-primary/40" />
          </div>
        </div>
      </div>

      {/* Why Sell on NexCart */}
      <div className="max-w-6xl mx-auto mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Why Sell on NexCart?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card border rounded-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Massive Reach</h3>
            <p className="text-sm text-muted-foreground">Reach millions of active shoppers looking for products like yours every day.</p>
          </div>
          <div className="bg-card border rounded-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">Get paid on time, every time. We handle fraud protection and payment processing.</p>
          </div>
          <div className="bg-card border rounded-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
            <p className="text-sm text-muted-foreground">List your products in minutes with our intuitive dashboard and bulk upload tools.</p>
          </div>
          <div className="bg-card border rounded-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Powerful Analytics</h3>
            <p className="text-sm text-muted-foreground">Track your sales, optimize your listings, and grow your business with detailed insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
