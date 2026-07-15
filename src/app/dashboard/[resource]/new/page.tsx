import { notFound, redirect } from "next/navigation";
import { getResource } from "@/lib/resources";
import { getCurrentUser } from "@/lib/auth";
import { loadRelationOptions } from "@/lib/loadOptions";
import PageHeader from "@/components/admin/PageHeader";
import ResourceForm from "@/components/admin/ResourceForm";

export default async function ResourceCreatePage({
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

  const options = await loadRelationOptions(cfg);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Nouveau : ${cfg.labelSingular}`}
        subtitle={`Ajouter un enregistrement dans « ${cfg.labelPlural} »`}
      />
      <ResourceForm cfg={cfg} mode="new" options={options} />
    </div>
  );
}
