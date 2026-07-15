import type { Metadata } from "next";
import { Link2, Percent, TrendingUp } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JoinAffiliateButton } from "@/components/marketing/join-affiliate-button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description: `Earn commission promoting ${siteConfig.name} products.`,
};

const steps = [
  { icon: Link2, title: "Get your link", desc: "Sign up and get a unique referral code to share anywhere." },
  { icon: TrendingUp, title: "Drive traffic", desc: "Share products with your audience across social, blogs, or email." },
  { icon: Percent, title: "Earn commission", desc: "Get paid on every qualifying sale, with transparent monthly payouts." },
];

export default function AffiliateProgramPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Affiliate Program" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Affiliate Program</h1>
      <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
        Earn a commission for every sale you refer to {siteConfig.name}. No minimum audience size
        required — just share what you love.
      </p>

      <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <step.icon className="size-6 text-primary" />
            <h3 className="mt-3 font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <JoinAffiliateButton />
      </div>
    </div>
  );
}
