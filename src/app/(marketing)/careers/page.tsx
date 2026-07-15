import type { Metadata } from "next";
import { Briefcase, MapPin } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Careers",
  description: `Join the team building ${siteConfig.name}.`,
};

const openings = [
  { title: "Senior Full Stack Engineer", team: "Engineering", location: "Bengaluru / Remote", type: "Full-time" },
  { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time" },
  { title: "Category Manager — Electronics", team: "Merchandising", location: "Bengaluru", type: "Full-time" },
  { title: "Customer Support Specialist", team: "Support", location: "Remote", type: "Full-time" },
  { title: "Performance Marketing Manager", team: "Marketing", location: "Bengaluru", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Careers" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Careers at {siteConfig.name}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        We&apos;re building the shopping experience millions of people use every day. Come build it
        with us.
      </p>

      <div className="mt-10 space-y-3">
        {openings.map((role) => (
          <div
            key={role.title}
            className="flex flex-col justify-between gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="font-semibold">{role.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3.5" /> {role.team}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {role.location}
                </span>
                <span>{role.type}</span>
              </div>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <a href={`mailto:${siteConfig.supportEmail}?subject=Application: ${role.title}`}>Apply</a>
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Don&apos;t see a role that fits? Send your resume to{" "}
        <a href={`mailto:${siteConfig.supportEmail}`} className="text-primary hover:underline">
          {siteConfig.supportEmail}
        </a>{" "}
        — we&apos;re always looking for great people.
      </p>
    </div>
  );
}
