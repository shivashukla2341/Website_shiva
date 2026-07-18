import { Metadata } from "next";
import { DollarSign, Share2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Affiliate Program | NexCart",
  description: "Earn money by referring customers to NexCart.",
};

export default function AffiliatePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero */}
      <div className="bg-primary/5 rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">NexCart Affiliate Program</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
          Partner with us and earn up to 10% commission on every successful referral. Turn your audience into an income stream.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="rounded-full px-8 text-base">Join Now for Free</Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 text-base bg-background">Learn More</Button>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <Share2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Share Links</h3>
            <p className="text-muted-foreground">Generate custom affiliate links for any product on NexCart and share them with your audience.</p>
          </div>
          <div className="p-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Track Sales</h3>
            <p className="text-muted-foreground">Use our intuitive dashboard to track your clicks, conversions, and earnings in real-time.</p>
          </div>
          <div className="p-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Get Paid</h3>
            <p className="text-muted-foreground">Receive your commission payouts directly to your bank account every month.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
