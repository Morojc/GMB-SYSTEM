"use server";

import { prisma } from "@/lib/prisma";
import { getResource } from "@/lib/resources";
import { coerceValue } from "@/lib/format";
import { requireRole } from "@/lib/auth";
import type { ResourceConfig } from "@/lib/resources/types";
import { revalidatePath } from "next/cache";

export interface ActionState {
  ok: boolean;
  error?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function model(cfg: ResourceConfig) {
  return (prisma as any)[cfg.model];
}

async function guard(cfg: ResourceConfig) {
  await requireRole(cfg.adminOnly ? ["ADMIN"] : ["ADMIN", "EMPLOYE"]);
}

/** Build the Prisma `data` object from submitted form fields. */
function buildData(cfg: ResourceConfig, formData: FormData) {
  const data: Record<string, unknown> = {};
  for (const f of cfg.fields) {
    if (!f.inForm) continue;
    const value = coerceValue(f.type, formData.get(f.name));
    if (value !== null || f.required) data[f.name] = value;
  }
  return data;
}

/** Build the Prisma `where` object for single or composite primary keys. */
function whereForId(cfg: ResourceConfig, id: string): Record<string, unknown> {
  if (cfg.idFields && cfg.idFields.length > 1) {
    const parts = id.split("__");
    const compound: Record<string, number> = {};
    cfg.idFields.forEach((field, i) => {
      compound[field] = parseInt(parts[i], 10);
    });
    return { [cfg.idFields.join("_")]: compound };
  }
  return { [cfg.idField]: parseInt(id, 10) };
}

/**
 * Create or update a record. Used with `useActionState`; the resource key,
 * mode and id travel as hidden form fields.
 */
export async function submitResource(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const key = String(formData.get("__key"));
  const mode = String(formData.get("__mode"));
  const id = String(formData.get("__id") ?? "");
  try {
    const cfg = getResource(key);
    await guard(cfg);
    const data = buildData(cfg, formData);
    if (mode === "edit") {
      await model(cfg).update({ where: whereForId(cfg, id), data });
    } else {
      await model(cfg).create({ data });
    }
    revalidatePath(`/dashboard/${key}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteRecord(key: string, id: string): Promise<ActionState> {
  try {
    const cfg = getResource(key);
    await guard(cfg);
    await model(cfg).delete({ where: whereForId(cfg, id) });
    revalidatePath(`/dashboard/${key}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
