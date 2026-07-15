import type { ResourceConfig } from "./types";

export const client: ResourceConfig = {
  key: "clients",
  model: "client",
  idField: "id_client",
  labelSingular: "Client",
  labelPlural: "Clients",
  icon: "👤",
  group: "Ventes",
  fields: [
    { name: "id_client", label: "ID", type: "number", inList: true, inForm: false },
    {
      name: "id_personne",
      label: "Personne",
      type: "relation",
      inList: true,
      inForm: true,
      required: true,
      relation: {
        model: "personne",
        valueField: "id_personne",
        labelField: ["prenom", "nom"],
        accessor: "personne",
      },
    },
    {
      name: "email_display",
      label: "Email",
      type: "relation",
      inList: true,
      inForm: false,
      relation: {
        model: "personne",
        valueField: "id_personne",
        labelField: "email",
        accessor: "personne",
      },
    },
  ],
  listInclude: { personne: true },
};
