import type { FieldType } from "./resources/types";

/** Convert a raw form string into the value Prisma expects for a field type. */
export function coerceValue(type: FieldType, raw: unknown): unknown {
  if (raw === "" || raw === undefined || raw === null) return null;
  switch (type) {
    case "number":
    case "relation":
      return parseInt(String(raw), 10);
    case "decimal":
      return parseFloat(String(raw));
    case "date":
      return new Date(String(raw));
    default:
      return String(raw);
  }
}

/** Format a stored value for display in a table cell. */
export function formatValue(type: FieldType, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "decimal") return Number(value).toFixed(2);
  if (type === "date") return new Date(String(value)).toLocaleDateString("fr-FR");
  return String(value);
}

/** Read a nested value by dot-path, e.g. getPath(row, "client.personne"). */
export function getPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((o, k) => (o == null ? o : (o as Record<string, unknown>)[k]), obj);
}

/** Join one or more label keys (dot-paths) resolved against a base object. */
export function relationLabel(base: unknown, labelField: string | string[]): string {
  if (base == null || typeof base !== "object") return "—";
  const keys = Array.isArray(labelField) ? labelField : [labelField];
  const parts = keys
    .map((k) => getPath(base, k))
    .filter((v) => v !== null && v !== undefined && v !== "");
  return parts.length ? parts.join(" ") : "—";
}

/** Format a value for a date <input type="date"> (YYYY-MM-DD). */
export function toDateInputValue(value: unknown): string {
  if (!value) return "";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
