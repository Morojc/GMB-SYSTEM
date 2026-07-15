import type { ResourceConfig } from "./types";

export const typeProduit: ResourceConfig = {
  key: "types-produit",
  model: "type_produit",
  idField: "id_type",
  labelSingular: "Type de produit",
  labelPlural: "Types de produit",
  icon: "🏷️",
  group: "Production",
  fields: [
    { name: "id_type", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom_type", label: "Nom du type", type: "text", inList: true, inForm: true, required: true },
  ],
  searchFields: ["nom_type"],
};
