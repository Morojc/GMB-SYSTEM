import type { ResourceConfig } from "./types";

/**
 * Personne is the master identity table. Passwords are intentionally NOT
 * editable here — they are set at signup/seed and hashed; exposing a raw
 * password field in a generic form would store plaintext.
 */
export const personne: ResourceConfig = {
  key: "personnes",
  model: "personne",
  idField: "id_personne",
  labelSingular: "Personne",
  labelPlural: "Personnes",
  icon: "🪪",
  group: "Système",
  adminOnly: true,
  fields: [
    { name: "id_personne", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
    { name: "prenom", label: "Prénom", type: "text", inList: true, inForm: true, required: true },
    { name: "email", label: "Email", type: "email", inList: true, inForm: true },
    { name: "telephone", label: "Téléphone", type: "text", inList: true, inForm: true },
    { name: "adresse", label: "Adresse", type: "textarea", inForm: true },
  ],
  searchFields: ["nom", "prenom", "email"],
};

export const roleEmploye: ResourceConfig = {
  key: "roles",
  model: "role_employe",
  idField: "id_role",
  labelSingular: "Rôle",
  labelPlural: "Rôles",
  icon: "🎖️",
  group: "RH",
  adminOnly: true,
  fields: [
    { name: "id_role", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom_role", label: "Nom du rôle", type: "text", inList: true, inForm: true, required: true },
    { name: "tache", label: "Tâche / description", type: "textarea", inList: true, inForm: true },
  ],
  searchFields: ["nom_role"],
};

export const salaire: ResourceConfig = {
  key: "salaires",
  model: "salaire",
  idField: "id_salaire",
  labelSingular: "Salaire",
  labelPlural: "Salaires",
  icon: "💰",
  group: "RH",
  adminOnly: true,
  fields: [
    { name: "id_salaire", label: "ID", type: "number", inList: true, inForm: false },
    {
      name: "id_employe",
      label: "Employé",
      type: "relation",
      inList: true,
      inForm: true,
      required: true,
      relation: {
        model: "employe",
        valueField: "id_employe",
        labelField: ["prenom", "nom"],
        accessor: "employe.personne",
        optionInclude: { personne: true },
        optionLabel: ["personne.prenom", "personne.nom"],
      },
    },
    { name: "montant", label: "Montant (MAD)", type: "decimal", inList: true, inForm: true },
    { name: "date_modification", label: "Date", type: "date", inList: true, inForm: true },
  ],
  listInclude: { employe: { include: { personne: true } } },
};
