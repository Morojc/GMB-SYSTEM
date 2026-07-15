import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getResource } from "@/lib/resources";
import { getCurrentUser } from "@/lib/auth";
import { loadRelationOptions } from "@/lib/loadOptions";
import PageHeader from "@/components/admin/PageHeader";
import ResourceForm from "@/components/admin/ResourceForm";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function ResourceEditPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource, id } = await params;

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

  const where =
    cfg.idFields && cfg.idFields.length > 1
      ? {
          [cfg.idFields.join("_")]: Object.fromEntries(
            cfg.idFields.map((f, i) => [f, parseInt(id.split("__")[i], 10)])
          ),
        }
      : { [cfg.idField]: parseInt(id, 10) };

  const record = await (prisma as any)[cfg.model].findUnique({ where });
  if (!record) notFound();

  const options = await loadRelationOptions(cfg);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Modifier : ${cfg.labelSingular}`}
        subtitle={`Enregistrement #${id}`}
      />
      <ResourceForm
        cfg={cfg}
        mode="edit"
        id={id}
        initialValues={record}
        options={options}
      />
    </div>
  );
}
