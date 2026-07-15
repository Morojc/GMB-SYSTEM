import { cookies } from "next/headers";
import { verifyToken, type JwtPayload, type Role } from "./jwt";

export { resolveRole } from "./roles";

/** Read + verify the auth cookie in a Server Component / Route / Action. */
export async function getCurrentUser(): Promise<JwtPayload | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

/** Throw "FORBIDDEN" unless the current user has one of the given roles. */
export async function requireRole(roles: Role[]): Promise<JwtPayload> {
  const user = await getCurrentUser();
  if (!user || !roles.includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}

/** True when the user may reach the staff dashboard. */
export function isStaff(role: Role | undefined): boolean {
  return role === "ADMIN" || role === "EMPLOYE";
}

/** True for administrators — the dashboard is admin-only. */
export function isAdmin(role: Role | undefined): boolean {
  return role === "ADMIN";
}
