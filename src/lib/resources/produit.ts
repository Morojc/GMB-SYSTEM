import type { ResourceConfig } from "./types";

export const produit: ResourceConfig = {
  key: "produits",
  model: "produit",
  idField: "id_produit",
  labelSingular: "Produit",
  labelPlural: "Produits",
  icon: "📦",
  group: "Production",
  fields: [
    { name: "id_produit", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
    { name: "prix", label: "Prix (MAD)", type: "decimal", inList: true, inForm: true },
    { name: "quantite_stock", label: "Stock", type: "number", inList: true, inForm: true },
    {
      name: "id_type",
      label: "Type",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "type_produit",
        valueField: "id_type",
        labelField: "nom_type",
        accessor: "type_produit",
      },
    },
  ],
  listInclude: { type_produit: true },
  searchFields: ["nom"],
};
