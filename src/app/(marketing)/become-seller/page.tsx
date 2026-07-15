import type { Metadata } from "next";
import { BarChart3, Package, Truck, Wallet } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BecomeSellerForm } from "@/components/marketing/become-seller-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Become a Seller",
  description: `Start selling on ${siteConfig.name} and reach millions of shoppers.`,
};

const benefits = [
  { icon: BarChart3, title: "Reach & Discovery", desc: "Get discovered by shoppers actively searching your category." },
  { icon: Package, title: "Simple Listing Tools", desc: "Bulk upload products, variants, and inventory from one dashboard." },
  { icon: Truck, title: "Fulfilment Support", desc: "Integrated shipping labels and pickup scheduling with logistics partners." },
  { icon: Wallet, title: "Fast Payouts", desc: "Transparent commission and weekly payouts straight to your bank account." },
];

export default function BecomeSellerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Become a Seller" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Sell on {siteConfig.name}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Join thousands of sellers growing their business with tools built for scale — from
        listings to logistics to payouts.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <b.icon className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Apply Now</h2>
          <BecomeSellerForm />
        </div>
      </div>
    </div>
  );
}
