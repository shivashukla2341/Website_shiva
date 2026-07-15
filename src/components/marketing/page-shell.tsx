import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">{children}</div>
    </div>
  );
}
