import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { requireUser } from "@/lib/security/authorize";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "shipping")
    .order("is_default", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-4 mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>
      <CheckoutClient addresses={addresses ?? []} />
    </div>
  );
}
