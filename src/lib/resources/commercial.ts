import type { ResourceConfig } from "./types";

export const ligneCommande: ResourceConfig = {
  key: "lignes-commande",
  model: "ligne_commande",
  idField: "id_ligne",
  labelSingular: "Ligne de commande",
  labelPlural: "Lignes de commande",
  icon: "➕",
  group: "Ventes",
  fields: [
    { name: "id_ligne", label: "ID", type: "number", inList: true, inForm: false },
    {
      name: "id_commande",
      label: "Commande",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "commande",
        valueField: "id_commande",
        labelField: "id_commande",
        accessor: "commande",
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
    { name: "quantite", label: "Quantité", type: "number", inList: true, inForm: true },
    { name: "prix_unitaire", label: "Prix unitaire (MAD)", type: "decimal", inList: true, inForm: true },
  ],
  listInclude: { commande: true, produit: true },
};

export const facture: ResourceConfig = {
  key: "factures",
  model: "facture",
  idField: "id_facture",
  labelSingular: "Facture de vente",
  labelPlural: "Factures de vente",
  icon: "🧮",
  group: "Ventes",
  fields: [
    { name: "id_facture", label: "ID", type: "number", inList: true, inForm: false },
    { name: "date_facture", label: "Date", type: "date", inList: true, inForm: true },
    { name: "montant", label: "Montant (MAD)", type: "decimal", inList: true, inForm: true },
    {
      name: "id_commande",
      label: "Commande",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "commande",
        valueField: "id_commande",
        labelField: "id_commande",
        accessor: "commande",
      },
    },
  ],
  listInclude: { commande: true },
};

export const bonCommande: ResourceConfig = {
  key: "bons-commande",
  model: "bon_commande",
  idField: "id_bon",
  labelSingular: "Bon de commande",
  labelPlural: "Bons de commande",
  icon: "📄",
  group: "Ventes",
  fields: [
    { name: "id_bon", label: "ID", type: "number", inList: true, inForm: false },
    { name: "date_creation", label: "Date de création", type: "date", inList: true, inForm: true },
    {
      name: "id_commande",
      label: "Commande",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "commande",
        valueField: "id_commande",
        labelField: "id_commande",
        accessor: "commande",
      },
    },
  ],
  listInclude: { commande: true },
};

export const livreur: ResourceConfig = {
  key: "livreurs",
  model: "livreur",
  idField: "id_livreur",
  labelSingular: "Livreur",
  labelPlural: "Livreurs",
  icon: "🚚",
  group: "Ventes",
  fields: [
    { name: "id_livreur", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
    { name: "telephone", label: "Téléphone", type: "text", inList: true, inForm: true },
  ],
  searchFields: ["nom"],
};

export const livraison: ResourceConfig = {
  key: "livraisons",
  model: "livraison",
  idField: "id_livraison",
  labelSingular: "Livraison",
  labelPlural: "Livraisons",
  icon: "📦",
  group: "Ventes",
  fields: [
    { name: "id_livraison", label: "ID", type: "number", inList: true, inForm: false },
    { name: "date_livraison", label: "Date", type: "date", inList: true, inForm: true },
    {
      name: "statut",
      label: "Statut",
      type: "select",
      inList: true,
      inForm: true,
      options: ["En attente", "Expédiée", "Livrée", "Annulée"],
    },
    {
      name: "id_facture",
      label: "Facture",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "facture",
        valueField: "id_facture",
        labelField: "id_facture",
        accessor: "facture",
      },
    },
    {
      name: "id_livreur",
      label: "Livreur",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "livreur",
        valueField: "id_livreur",
        labelField: "nom",
        accessor: "livreur",
      },
    },
  ],
  listInclude: { facture: true, livreur: true },
};

export const bonLivraison: ResourceConfig = {
  key: "bons-livraison",
  model: "bon_livraison",
  idField: "id_bon",
  labelSingular: "Bon de livraison",
  labelPlural: "Bons de livraison",
  icon: "📝",
  group: "Ventes",
  fields: [
    { name: "id_bon", label: "ID", type: "number", inList: true, inForm: false },
    { name: "date_creation", label: "Date de création", type: "date", inList: true, inForm: true },
    {
      name: "id_livraison",
      label: "Livraison",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "livraison",
        valueField: "id_livraison",
        labelField: "id_livraison",
        accessor: "livraison",
      },
    },
  ],
  listInclude: { livraison: true },
};
