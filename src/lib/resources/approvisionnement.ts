import type { ResourceConfig } from "./types";

export const fournisseur: ResourceConfig = {
  key: "fournisseurs",
  model: "fournisseur",
  idField: "id_fournisseur",
  labelSingular: "Fournisseur",
  labelPlural: "Fournisseurs",
  icon: "🚜",
  group: "Approvisionnement",
  fields: [
    { name: "id_fournisseur", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
    { name: "telephone", label: "Téléphone", type: "text", inList: true, inForm: true },
    { name: "email", label: "Email", type: "email", inList: true, inForm: true },
    { name: "adresse", label: "Adresse", type: "textarea", inForm: true },
  ],
  searchFields: ["nom", "email"],
};

export const achat: ResourceConfig = {
  key: "achats",
  model: "achat",
  idField: "id_achat",
  labelSingular: "Achat (blé / matière)",
  labelPlural: "Achats",
  icon: "🧾",
  group: "Approvisionnement",
  fields: [
    { name: "id_achat", label: "ID", type: "number", inList: true, inForm: false },
    {
      name: "id_fournisseur",
      label: "Fournisseur",
      type: "relation",
      inList: true,
      inForm: true,
      required: true,
      relation: {
        model: "fournisseur",
        valueField: "id_fournisseur",
        labelField: "nom",
        accessor: "fournisseur",
      },
    },
    { name: "date_achat", label: "Date", type: "date", inList: true, inForm: true },
    {
      name: "statut",
      label: "Statut",
      type: "select",
      inList: true,
      inForm: true,
      options: ["Commandé", "Reçu", "Annulé"],
    },
  ],
  listInclude: { fournisseur: true },
};

export const ligneAchat: ResourceConfig = {
  key: "lignes-achat",
  model: "ligne_achat",
  idField: "id_ligne_achat",
  labelSingular: "Ligne d'achat",
  labelPlural: "Lignes d'achat",
  icon: "➕",
  group: "Approvisionnement",
  fields: [
    { name: "id_ligne_achat", label: "ID", type: "number", inList: true, inForm: false },
    {
      name: "id_achat",
      label: "Achat",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "achat",
        valueField: "id_achat",
        labelField: "id_achat",
        accessor: "achat",
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
    { name: "quantite", label: "Quantité (kg)", type: "number", inList: true, inForm: true },
    { name: "prix_unitaire", label: "Prix unitaire (MAD)", type: "decimal", inList: true, inForm: true },
  ],
  listInclude: { achat: true, matiere_premiere: true },
};

export const factureAchat: ResourceConfig = {
  key: "factures-achat",
  model: "facture_achat",
  idField: "id_facture_achat",
  labelSingular: "Facture d'achat",
  labelPlural: "Factures d'achat",
  icon: "💸",
  group: "Approvisionnement",
  fields: [
    { name: "id_facture_achat", label: "ID", type: "number", inList: true, inForm: false },
    { name: "date_facture", label: "Date", type: "date", inList: true, inForm: true },
    { name: "montant", label: "Montant (MAD)", type: "decimal", inList: true, inForm: true },
    {
      name: "id_achat",
      label: "Achat",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "achat",
        valueField: "id_achat",
        labelField: "id_achat",
        accessor: "achat",
      },
    },
  ],
  listInclude: { achat: true },
};
