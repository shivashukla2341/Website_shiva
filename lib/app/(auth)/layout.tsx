// =============================================================================
// NEXCART — AUTH LAYOUT
// =============================================================================

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — NexCart",
  robots: { index: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-white font-black text-xl">
            N
          </div>
          <span className="font-display text-2xl font-bold gradient-text">NexCart</span>
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* Right: Visual */}
      <div className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center gradient-bg">
        {/* Floating orbs */}
        <div className="absolute h-96 w-96 rounded-full bg-white/10 blur-3xl" style={{ top: "10%", left: "20%" }} />
        <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl" style={{ bottom: "20%", right: "10%" }} />

        <div className="relative z-10 text-center text-white px-12">
          <div className="text-8xl mb-6 animate-float">🛍️</div>
          <h2 className="text-4xl font-bold mb-4">Premium Shopping, Elevated</h2>
          <p className="text-white/80 text-lg max-w-sm leading-relaxed">
            Join over 2 million shoppers who trust NexCart for the best prices and fastest delivery.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[
              { label: "Products", value: "1M+" },
              { label: "Customers", value: "2M+" },
              { label: "Brands", value: "500+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex items-center justify-center gap-3">
            {["🔒 Secure", "⚡ Fast Delivery", "🔄 Easy Returns"].map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
