export type FieldType =
  | "text"
  | "number"
  | "decimal"
  | "date"
  | "email"
  | "textarea"
  | "select"
  | "relation"
  | "badge";

export type ResourceGroup =
  | "Approvisionnement"
  | "Production"
  | "Stock"
  | "Ventes"
  | "RH"
  | "Système";

export interface RelationConfig {
  /** Prisma model name used to load option rows, e.g. "type_produit". */
  model: string;
  /** Field used as the <option> value / foreign key, e.g. "id_type". */
  valueField: string;
  /**
   * List display: key(s) on the accessed relation object used as its label,
   * e.g. "nom_type" or ["prenom", "nom"]. Dot-paths allowed.
   */
  labelField: string | string[];
  /** Dot-path from a list row to the included relation object, e.g. "client.personne". */
  accessor?: string;
  /** Prisma `include` used when loading <select> options. */
  optionInclude?: Record<string, unknown>;
  /**
   * Dot-path(s) from an option row to its label. Defaults to `labelField`
   * when the option row already exposes those keys directly.
   */
  optionLabel?: string | string[];
}

export interface FieldConfig {
  /** Prisma field name (snake_case), e.g. "date_commande". */
  name: string;
  /** French display label. */
  label: string;
  type: FieldType;
  required?: boolean;
  /** Show as a column in the list table. */
  inList?: boolean;
  /** Show as an input in the create/edit form. */
  inForm?: boolean;
  /** For type "relation". */
  relation?: RelationConfig;
  /** For type "select" / "badge" — allowed values. */
  options?: string[];
}

export interface ResourceConfig {
  /** URL slug, e.g. "produits". */
  key: string;
  /** Prisma model name, e.g. "produit". */
  model: string;
  /** Primary key field, e.g. "id_produit". */
  idField: string;
  /** For composite-key models, e.g. ["id_catalogue","id_produit"]. */
  idFields?: string[];
  labelSingular: string;
  labelPlural: string;
  icon: string;
  group: ResourceGroup;
  /** Restrict this resource to ADMIN users. */
  adminOnly?: boolean;
  fields: FieldConfig[];
  /** Prisma `include` for the list query (to render relation columns). */
  listInclude?: Record<string, unknown>;
  /** Field names the list search box filters on. */
  searchFields?: string[];
}
