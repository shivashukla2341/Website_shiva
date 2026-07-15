import Link from "next/link";
import { Bell, Heart, MapPin, Package, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/security/authorize";

const tiles = [
  { title: "My Orders", href: "/account/orders", icon: Package, desc: "Track, return or reorder" },
  { title: "Wishlist", href: "/account/wishlist", icon: Heart, desc: "Items you've saved" },
  { title: "Addresses", href: "/account/addresses", icon: MapPin, desc: "Manage delivery addresses" },
  { title: "Profile", href: "/account/profile", icon: User, desc: "Personal details" },
  { title: "Notifications", href: "/account/notifications", icon: Bell, desc: "Order & promo alerts" },
];

export default async function AccountOverviewPage() {
  const profile = await getCurrentProfile();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here&apos;s a quick look at your account.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href}>
            <Card className="transition-all hover:-translate-y-1 hover:shadow-elevated">
              <CardHeader className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <tile.icon className="size-5" />
                </div>
                <CardTitle className="text-base">{tile.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tile.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
