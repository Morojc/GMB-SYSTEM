"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitResource, type ActionState } from "@/lib/actions/crud";
import { toDateInputValue } from "@/lib/format";
import type { ResourceConfig, FieldConfig } from "@/lib/resources/types";
import type { Option } from "@/lib/loadOptions";

const initial: ActionState = { ok: false };

export default function ResourceForm({
  cfg,
  mode,
  id,
  initialValues = {},
  options = {},
}: {
  cfg: ResourceConfig;
  mode: "new" | "edit";
  id?: string;
  initialValues?: Record<string, unknown>;
  options?: Record<string, Option[]>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(submitResource, initial);

  useEffect(() => {
    if (state.ok) router.push(`/dashboard/${cfg.key}`);
  }, [state.ok, cfg.key, router]);

  const formFields = cfg.fields.filter((f) => f.inForm);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <input type="hidden" name="__key" value={cfg.key} />
      <input type="hidden" name="__mode" value={mode} />
      {id && <input type="hidden" name="__id" value={id} />}

      {formFields.map((field) => (
        <Field
          key={field.name}
          field={field}
          defaultValue={initialValues[field.name]}
          options={options[field.name]}
        />
      ))}

      {state.error && (
        <p className="rounded-md bg-clay/10 px-3 py-2 text-sm text-clay">{state.error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-wheat px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/dashboard/${cfg.key}`)}
          className="rounded-md border border-line px-5 py-2 text-sm font-medium text-roast-soft transition hover:bg-grain"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

function Field({
  field,
  defaultValue,
  options,
}: {
  field: FieldConfig;
  defaultValue: unknown;
  options?: Option[];
}) {
  const label = (
    <label className="mb-1 block text-sm font-medium text-roast">
      {field.label}
      {field.required && <span className="text-clay"> *</span>}
    </label>
  );
  const base =
    "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-wheat";

  if (field.type === "relation" || field.type === "select") {
    const opts =
      field.type === "select"
        ? (field.options ?? []).map((o) => ({ value: o, label: o }))
        : options ?? [];
    return (
      <div>
        {label}
        <select
          name={field.name}
          required={field.required}
          defaultValue={defaultValue != null ? String(defaultValue) : ""}
          className={base}
        >
          <option value="">— Sélectionner —</option>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          name={field.name}
          required={field.required}
          defaultValue={defaultValue != null ? String(defaultValue) : ""}
          rows={3}
          className={base}
        />
      </div>
    );
  }

  const inputType =
    field.type === "number" || field.type === "decimal"
      ? "number"
      : field.type === "date"
      ? "date"
      : field.type === "email"
      ? "email"
      : "text";

  const value =
    field.type === "date"
      ? toDateInputValue(defaultValue)
      : defaultValue != null
      ? String(defaultValue)
      : "";

  return (
    <div>
      {label}
      <input
        type={inputType}
        step={field.type === "decimal" ? "0.01" : undefined}
        name={field.name}
        required={field.required}
        defaultValue={value}
        className={base}
      />
    </div>
  );
}
