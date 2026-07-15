import { prisma } from "@/lib/prisma";
import { relationLabel } from "@/lib/format";
import type { ResourceConfig } from "@/lib/resources/types";

export interface Option {
  value: string;
  label: string;
}

/**
 * Load <select> options for every relation field of a resource form.
 * Returns a map keyed by the field name (the foreign-key column).
 */
export async function loadRelationOptions(
  cfg: ResourceConfig
): Promise<Record<string, Option[]>> {
  const result: Record<string, Option[]> = {};
  for (const field of cfg.fields) {
    if (!field.inForm || field.type !== "relation" || !field.relation) continue;
    const rel = field.relation;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const rows = await (prisma as any)[rel.model].findMany({
      include: rel.optionInclude,
    });
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    result[field.name] = rows.map((row: any) => ({
      value: String(row[rel.valueField]),
      label: relationLabel(row, rel.optionLabel ?? rel.labelField),
    }));
  }
  return result;
}
