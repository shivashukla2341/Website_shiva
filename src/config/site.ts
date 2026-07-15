export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Website Shiva",
  description:
    "Premium shopping, delivered. Discover electronics, fashion, home and more with fast delivery and secure checkout.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
  supportEmail: "support@example.com",
  currency: "INR",
  currencySymbol: "₹",
} as const;

export type SiteConfig = typeof siteConfig;
