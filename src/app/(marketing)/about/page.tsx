import type { Metadata } from "next";
import { Globe2, Heart, ShieldCheck, Sparkles } from "lucide-react";

import { PageShell } from "@/components/marketing/page-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} — our mission, values, and how we're building a better way to shop online.`,
};

const values = [
  { icon: Heart, title: "Customer First", desc: "Every decision starts with what's best for the people shopping with us." },
  { icon: ShieldCheck, title: "Trust & Safety", desc: "Verified sellers, secure payments, and transparent pricing on every order." },
  { icon: Sparkles, title: "Curated Quality", desc: "We work directly with brands and sellers to keep the catalog genuinely good." },
  { icon: Globe2, title: "Built for Scale", desc: "From flash sales to everyday essentials, our platform is built to handle it all." },
];

export default function AboutPage() {
  return (
    <PageShell
      title="About Us"
      subtitle={`${siteConfig.name} is on a mission to make online shopping faster, safer, and more delightful.`}
    >
      <p>
        We started {siteConfig.name} with a simple idea: shopping online should feel as good as
        the products you receive. That means fast, reliable delivery, prices you can trust, and a
        support team that actually helps when something goes wrong.
      </p>
      <p>
        Today we work with thousands of sellers and brands across electronics, fashion, home, and
        beauty to bring a curated, quality-checked catalog to shoppers everywhere — backed by
        secure payments, GST-compliant invoicing, and an easy returns process.
      </p>

      <div className="not-prose mt-10 grid gap-4 sm:grid-cols-2">
        {values.map((value) => (
          <div key={value.title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <value.icon className="size-6 text-primary" />
            <h3 className="mt-3 font-semibold">{value.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{value.desc}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
