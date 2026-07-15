import Link from "next/link";

import { requireUser, getCurrentProfile } from "@/lib/security/authorize";
import { accountNav } from "@/config/nav";
import { signOutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  const profile = await getCurrentProfile();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
            <div className="bg-gradient-brand flex size-11 items-center justify-center rounded-full text-lg font-bold text-white">
              {(profile?.full_name ?? "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{profile?.full_name ?? "Your Account"}</p>
              <p className="truncate text-xs text-muted-foreground">{profile?.role}</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-card p-2 shadow-soft lg:flex-col lg:overflow-visible">
            {accountNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <form action={signOutAction} className="mt-2">
            <Button type="submit" variant="outline" className="w-full rounded-xl">
              Sign Out
            </Button>
          </form>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
