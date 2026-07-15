"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatValue, getPath, relationLabel } from "@/lib/format";
import type { ResourceConfig, FieldConfig } from "@/lib/resources/types";
import Badge from "./Badge";
import DeleteButton from "./DeleteButton";

type Row = Record<string, unknown>;

function rowId(cfg: ResourceConfig, row: Row): string {
  if (cfg.idFields && cfg.idFields.length > 1) {
    return cfg.idFields.map((f) => row[f]).join("__");
  }
  return String(row[cfg.idField]);
}

function cellText(field: FieldConfig, row: Row): string {
  if (field.type === "relation" && field.relation) {
    const base = field.relation.accessor
      ? getPath(row, field.relation.accessor)
      : row[field.name];
    if (base && typeof base === "object") {
      return relationLabel(base, field.relation.labelField);
    }
    return formatValue("text", row[field.name]);
  }
  return formatValue(field.type, row[field.name]);
}

export default function DataTable({
  cfg,
  rows,
}: {
  cfg: ResourceConfig;
  rows: Row[];
}) {
  const [query, setQuery] = useState("");
  const columns = cfg.fields.filter((f) => f.inList);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      columns.some((c) => cellText(c, row).toLowerCase().includes(q))
    );
  }, [query, rows, columns]);

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Rechercher…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-sm rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-wheat"
      />

      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-grain/60 text-left text-roast-soft">
                {columns.map((c) => (
                  <th key={c.name} className="px-5 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((row, i) => {
                  const id = rowId(cfg, row);
                  return (
                    <tr
                      key={id}
                      className={`border-t border-line/70 transition hover:bg-wheat-soft/20 ${
                        i % 2 ? "bg-grain/30" : "bg-surface"
                      }`}
                    >
                      {columns.map((c) => (
                        <td key={c.name} className="px-5 py-3 text-roast">
                          {c.type === "select" || c.type === "badge" ? (
                            row[c.name] ? (
                              <Badge value={String(row[c.name])} />
                            ) : (
                              "—"
                            )
                          ) : (
                            cellText(c, row)
                          )}
                        </td>
                      ))}
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/dashboard/${cfg.key}/${id}/edit`}
                            className="rounded-md px-2 py-1 text-sm font-medium text-wheat transition hover:bg-wheat/10"
                          >
                            Modifier
                          </Link>
                          <DeleteButton
                            resourceKey={cfg.key}
                            id={id}
                            label={cellText(columns[1] ?? columns[0], row)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-5 py-12 text-center text-roast-soft"
                  >
                    Aucun enregistrement.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
