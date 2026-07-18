// =============================================================================
// NEXCART — FOOTER
// =============================================================================

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  Truck,
  RefreshCw,
  HeadphonesIcon,
} from "lucide-react";

const Twitter = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const Instagram = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const Facebook = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Youtube = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;
const Linkedin = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const SHOP_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Best Sellers", href: "/products?filter=best_seller" },
  { label: "Flash Sale", href: "/offers" },
  { label: "Trending", href: "/products?filter=trending" },
  { label: "Brands", href: "/brands" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Affiliate Program", href: "/affiliate" },
  { label: "Become a Seller", href: "/become-seller" },
  { label: "Contact Us", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Help Center / FAQ", href: "/faq" },
  { label: "Track Your Order", href: "/orders" },
  { label: "Return & Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL_LINKS = [
  { icon: Twitter, href: "https://twitter.com/nexcart", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/nexcart", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/nexcart", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com/nexcart", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com/company/nexcart", label: "LinkedIn" },
];

const TRUST_BADGES = [
  { icon: Shield, title: "Secure Payments", desc: "256-bit SSL encryption" },
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹499" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Always here to help" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Trust Badges */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.title}
                className="flex items-center gap-3 rounded-xl p-4 bg-card border border-border"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-bg">
                  <badge.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{badge.title}</p>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg text-white font-black text-lg">
                N
              </div>
              <span className="font-display text-2xl font-bold gradient-text">NexCart</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Your one-stop destination for premium products at unbeatable prices.
              Shop with confidence — quality guaranteed.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold mb-2">Stay updated</p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 flex-1 rounded-lg text-sm"
                />
                <Button size="sm" className="h-9 gradient-bg hover:opacity-90 shrink-0">
                  Subscribe
                </Button>
              </form>
              <p className="mt-1.5 text-xs text-muted-foreground">
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Shop</h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Support</h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <a
                href="mailto:support@nexcart.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                support@nexcart.com
              </a>
              <a
                href="tel:+919999999999"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                +91-9999-999-999
              </a>
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                123 Tech Park, Bengaluru, Karnataka 560001
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator />
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NexCart. All rights reserved.
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Accepted payments:</span>
            {["Visa", "Mastercard", "UPI", "Razorpay", "Stripe"].map((method) => (
              <span
                key={method}
                className="rounded border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {method}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
