import type { ResourceConfig } from "./types";

export const employe: ResourceConfig = {
  key: "employes",
  model: "employe",
  idField: "id_employe",
  labelSingular: "Employé",
  labelPlural: "Employés",
  icon: "👷",
  group: "RH",
  adminOnly: true,
  fields: [
    { name: "id_employe", label: "ID", type: "number", inList: true, inForm: false },
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
      name: "id_role",
      label: "Rôle",
      type: "relation",
      inList: true,
      inForm: true,
      relation: {
        model: "role_employe",
        valueField: "id_role",
        labelField: "nom_role",
        accessor: "role_employe",
      },
    },
    { name: "date_embauche", label: "Date d'embauche", type: "date", inList: true, inForm: true },
  ],
  listInclude: { personne: true, role_employe: true },
};
