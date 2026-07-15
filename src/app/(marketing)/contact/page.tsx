import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ContactForm } from "@/components/marketing/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our support team — we typically respond within 24 hours.",
};

const info = [
  { icon: Mail, label: "Email", value: siteConfig.supportEmail },
  { icon: Phone, label: "Phone", value: "+91 1800-123-4567" },
  { icon: MapPin, label: "Office", value: "Bengaluru, Karnataka, India" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Contact Us</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Have a question about an order, a product, or becoming a seller? Send us a message and
        we&apos;ll get back to you within 24 hours.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <ContactForm />
        </div>

        <div className="space-y-4">
          {info.map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
              <item.icon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
