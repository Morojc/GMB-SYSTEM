import type { ResourceConfig } from "./types";

export const commande: ResourceConfig = {
  key: "commandes",
  model: "commande",
  idField: "id_commande",
  labelSingular: "Commande",
  labelPlural: "Commandes",
  icon: "🧾",
  group: "Ventes",
  fields: [
    { name: "id_commande", label: "ID", type: "number", inList: true, inForm: false },
    {
      name: "id_client",
      label: "Client",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "client",
        valueField: "id_client",
        labelField: ["prenom", "nom"],
        accessor: "client.personne",
        optionInclude: { personne: true },
        optionLabel: ["personne.prenom", "personne.nom"],
      },
    },
    { name: "date_commande", label: "Date", type: "date", inList: true, inForm: true },
    {
      name: "statut",
      label: "Statut",
      type: "select",
      inList: true,
      inForm: true,
      options: ["En attente", "Validée", "En préparation", "Livrée", "Annulée"],
    },
  ],
  listInclude: { client: { include: { personne: true } } },
};
