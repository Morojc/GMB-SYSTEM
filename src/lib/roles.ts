import type { Role } from "./jwt";

/** Employee role names that grant full administrative access. */
export const ADMIN_ROLE_NAMES = ["Admin", "Administrateur"];

/**
 * Derive the effective auth role from a `personne` and its optional
 * `employe` / `client` relations. Pure — safe to unit test.
 */
export function resolveRole(p: {
  employe?: { role_employe?: { nom_role?: string | null } | null } | null;
  client?: unknown | null;
}): Role {
  if (p.employe) {
    const name = p.employe.role_employe?.nom_role ?? "";
    return ADMIN_ROLE_NAMES.includes(name) ? "ADMIN" : "EMPLOYE";
  }
  if (p.client) return "CLIENT";
  return "CLIENT";
}
