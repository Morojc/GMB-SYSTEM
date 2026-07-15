import type { ResourceConfig } from "./types";

export const silon: ResourceConfig = {
  key: "silos",
  model: "silon",
  idField: "id_silon",
  labelSingular: "Silo",
  labelPlural: "Silos",
  icon: "🏗️",
  group: "Production",
  fields: [
    { name: "id_silon", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
    { name: "capacite", label: "Capacité (kg)", type: "number", inList: true, inForm: true },
  ],
  searchFields: ["nom"],
};

export const matierePremiere: ResourceConfig = {
  key: "matieres",
  model: "matiere_premiere",
  idField: "id_matiere",
  labelSingular: "Matière première",
  labelPlural: "Matières premières",
  icon: "🌾",
  group: "Production",
  fields: [
    { name: "id_matiere", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
    { name: "quantite", label: "Quantité (kg)", type: "number", inList: true, inForm: true },
    {
      name: "id_silon",
      label: "Silo",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "silon",
        valueField: "id_silon",
        labelField: "nom",
        accessor: "silon",
      },
    },
  ],
  listInclude: { silon: true },
  searchFields: ["nom"],
};

export const catalogue: ResourceConfig = {
  key: "catalogues",
  model: "catalogue",
  idField: "id_catalogue",
  labelSingular: "Catalogue",
  labelPlural: "Catalogues",
  icon: "📚",
  group: "Production",
  fields: [
    { name: "id_catalogue", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
  ],
  searchFields: ["nom"],
};

/** Composite-key join table linking catalogues and products. */
export const catalogueProduit: ResourceConfig = {
  key: "catalogue-produits",
  model: "catalogue_produit",
  idField: "id_catalogue",
  idFields: ["id_catalogue", "id_produit"],
  labelSingular: "Produit du catalogue",
  labelPlural: "Produits par catalogue",
  icon: "🔗",
  group: "Production",
  fields: [
    {
      name: "id_catalogue",
      label: "Catalogue",
      type: "relation",
      inList: true,
      inForm: true,
      required: true,
      relation: {
        model: "catalogue",
        valueField: "id_catalogue",
        labelField: "nom",
        accessor: "catalogue",
      },
    },
    {
      name: "id_produit",
      label: "Produit",
      type: "relation",
      inList: true,
      inForm: true,
      required: true,
      relation: {
        model: "produit",
        valueField: "id_produit",
        labelField: "nom",
        accessor: "produit",
      },
    },
  ],
  listInclude: { catalogue: true, produit: true },
};
