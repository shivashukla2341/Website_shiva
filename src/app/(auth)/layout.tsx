import Link from "next/link";

import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-mesh flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="bg-gradient-brand flex size-10 items-center justify-center rounded-xl text-lg font-bold text-white shadow-soft">
            {siteConfig.name.charAt(0)}
          </span>
          <span className="text-xl font-bold tracking-tight">{siteConfig.name}</span>
        </Link>
        <div className="glass-panel rounded-3xl p-8 shadow-elevated">{children}</div>
      </div>
    </div>
  );
}
