import type { ResourceConfig } from "./types";

export const fabrication: ResourceConfig = {
  key: "fabrications",
  model: "fabrication",
  idField: "id_fabrication",
  labelSingular: "Fabrication",
  labelPlural: "Fabrications",
  icon: "🏭",
  group: "Production",
  fields: [
    { name: "id_fabrication", label: "ID", type: "number", inList: true, inForm: false },
    { name: "date_fabrication", label: "Date", type: "date", inList: true, inForm: true },
    {
      name: "statut",
      label: "Statut",
      type: "select",
      inList: true,
      inForm: true,
      options: ["En cours", "Terminée", "Annulée"],
    },
    { name: "note", label: "Note", type: "textarea", inForm: true },
  ],
};

export const fabricationIntrant: ResourceConfig = {
  key: "intrants",
  model: "fabrication_intrant",
  idField: "id_intrant",
  labelSingular: "Intrant de fabrication",
  labelPlural: "Intrants (matières consommées)",
  icon: "🌾",
  group: "Production",
  fields: [
    { name: "id_intrant", label: "ID", type: "number", inList: true, inForm: false },
    {
      name: "id_fabrication",
      label: "Fabrication",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "fabrication",
        valueField: "id_fabrication",
        labelField: "id_fabrication",
        accessor: "fabrication",
      },
    },
    {
      name: "id_matiere",
      label: "Matière première",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "matiere_premiere",
        valueField: "id_matiere",
        labelField: "nom",
        accessor: "matiere_premiere",
      },
    },
    { name: "quantite", label: "Quantité consommée (kg)", type: "number", inList: true, inForm: true },
  ],
  listInclude: { fabrication: true, matiere_premiere: true },
};

export const fabricationProduit: ResourceConfig = {
  key: "produits-fabriques",
  model: "fabrication_produit",
  idField: "id_fab_produit",
  labelSingular: "Produit fabriqué",
  labelPlural: "Produits fabriqués",
  icon: "📦",
  group: "Production",
  fields: [
    { name: "id_fab_produit", label: "ID", type: "number", inList: true, inForm: false },
    {
      name: "id_fabrication",
      label: "Fabrication",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "fabrication",
        valueField: "id_fabrication",
        labelField: "id_fabrication",
        accessor: "fabrication",
      },
    },
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
    { name: "quantite", label: "Quantité produite", type: "number", inList: true, inForm: true },
  ],
  listInclude: { fabrication: true, produit: true },
};
