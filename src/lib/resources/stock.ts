import type { ResourceConfig } from "./types";

export const stock: ResourceConfig = {
  key: "stock",
  model: "stock",
  idField: "id_stock",
  labelSingular: "Entrée de stock",
  labelPlural: "Stock",
  icon: "📊",
  group: "Stock",
  fields: [
    { name: "id_stock", label: "ID", type: "number", inList: true, inForm: false },
    {
      name: "id_produit",
      label: "Produit",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "produit",
        valueField: "id_produit",
        labelField: "nom",
        accessor: "produit",
      },
    },
    {
      name: "id_zone",
      label: "Zone",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "zone_stock",
        valueField: "id_zone",
        labelField: "nom",
        accessor: "zone_stock",
      },
    },
    { name: "quantite", label: "Quantité", type: "number", inList: true, inForm: true },
  ],
  listInclude: { produit: true, zone_stock: true },
};
