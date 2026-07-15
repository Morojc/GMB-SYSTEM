import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getResource } from "@/lib/resources";
import { getCurrentUser } from "@/lib/auth";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;

  let cfg;
  try {
    cfg = getResource(resource);
  } catch {
    notFound();
  }

  if (cfg.adminOnly) {
    const user = await getCurrentUser();
    if (user?.role !== "ADMIN") redirect("/dashboard");
  }

  const rows = await (prisma as any)[cfg.model].findMany({
    include: cfg.listInclude,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={cfg.labelPlural}
        subtitle={`${rows.length} enregistrement${rows.length > 1 ? "s" : ""}`}
        actionHref={`/dashboard/${cfg.key}/new`}
        actionLabel={`+ Ajouter`}
      />
      <DataTable cfg={cfg} rows={rows} />
    </div>
  );
}
