import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { footerNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-gradient-brand flex size-9 items-center justify-center rounded-xl font-bold text-white">
                {siteConfig.name.charAt(0)}
              </span>
              <span className="text-lg font-bold tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <form className="mt-6 flex max-w-sm gap-2">
              <Input type="email" placeholder="you@example.com" className="rounded-full" />
              <Button type="submit" className="shrink-0 rounded-full">
                Subscribe
              </Button>
            </form>
            <div className="mt-6 flex gap-3">
              {[
                { label: "X", href: siteConfig.links.twitter },
                { label: "IG", href: siteConfig.links.instagram },
                { label: "FB", href: siteConfig.links.facebook },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Secure payments via Razorpay &amp; Stripe · GST invoices on every order
          </p>
        </div>
      </div>
    </footer>
  );
}
