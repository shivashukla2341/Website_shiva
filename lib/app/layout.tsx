// =============================================================================
// NEXCART — ROOT LAYOUT
// =============================================================================

import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Geist } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/shared/query-provider";
import { AnalyticsProvider } from "@/components/shared/analytics-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// ─── Fonts ──────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "NexCart — Premium E-Commerce Experience",
    template: "%s | NexCart",
  },
  description:
    "Discover millions of products at unbeatable prices. Shop electronics, fashion, home & more with fast delivery and easy returns.",
  keywords: [
    "ecommerce",
    "online shopping",
    "buy online",
    "NexCart",
    "best prices",
    "fast delivery",
  ],
  authors: [{ name: "NexCart" }],
  creator: "NexCart",
  publisher: "NexCart",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "NexCart",
    title: "NexCart — Premium E-Commerce Experience",
    description:
      "Discover millions of products at unbeatable prices. Shop electronics, fashion, home & more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexCart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexCart — Premium E-Commerce Experience",
    description:
      "Discover millions of products at unbeatable prices.",
    images: ["/og-image.png"],
    creator: "@nexcart",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, plusJakartaSans.variable, "font-sans", geist.variable)}
    >
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* Schema.org Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NexCart",
              url: process.env.NEXT_PUBLIC_APP_URL,
              logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "support@nexcart.com",
              },
              sameAs: [
                "https://twitter.com/nexcart",
                "https://instagram.com/nexcart",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AnalyticsProvider>
              {children}
              <Toaster
                position="bottom-right"
                richColors
                closeButton
                expand={false}
                duration={4000}
              />
            </AnalyticsProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
