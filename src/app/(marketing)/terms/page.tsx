import type { Metadata } from "next";

import { PageShell } from "@/components/marketing/page-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms and conditions governing your use of ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <PageShell title="Terms of Service" subtitle="Last updated: January 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By creating an account or placing an order on {siteConfig.name}, you agree to be bound by
        these Terms of Service and our Privacy Policy.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and
        for all activity under your account. You must provide accurate information at signup and
        keep it up to date.
      </p>

      <h2>3. Orders & Pricing</h2>
      <p>
        Prices are listed in INR (unless otherwise stated) and include applicable GST. We reserve
        the right to cancel orders in cases of pricing errors, suspected fraud, or unavailable
        inventory — in which case any amount charged will be refunded in full.
      </p>

      <h2>4. Third-Party Sellers</h2>
      <p>
        Some products are listed and fulfilled by third-party sellers on our Marketplace. While we
        vet sellers before onboarding, {siteConfig.name} facilitates the transaction; the seller is
        responsible for the accuracy of listings and product quality, subject to our Refund Policy.
      </p>

      <h2>5. Prohibited Conduct</h2>
      <ul>
        <li>Using the platform for any unlawful purpose or to violate any regulation.</li>
        <li>Attempting to interfere with, compromise, or gain unauthorized access to our systems.</li>
        <li>Posting fraudulent reviews or manipulating ratings.</li>
        <li>Reselling products purchased through consumer pricing at commercial scale without authorization.</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        All content on {siteConfig.name} — including logos, design, and text — is owned by us or
        our licensors and may not be reproduced without permission.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        {siteConfig.name} is not liable for indirect, incidental, or consequential damages arising
        from your use of the platform, to the maximum extent permitted by law.
      </p>

      <h2>8. Governing Law</h2>
      <p>These Terms are governed by the laws of India, with courts in Bengaluru having exclusive jurisdiction.</p>

      <h2>9. Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
      </p>
    </PageShell>
  );
}
