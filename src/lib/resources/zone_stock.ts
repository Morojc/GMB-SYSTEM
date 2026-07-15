import type { ResourceConfig } from "./types";

export const zoneStock: ResourceConfig = {
  key: "zones",
  model: "zone_stock",
  idField: "id_zone",
  labelSingular: "Zone de stockage",
  labelPlural: "Zones de stockage",
  icon: "🗺️",
  group: "Stock",
  fields: [
    { name: "id_zone", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
    { name: "capacite", label: "Capacité", type: "number", inList: true, inForm: true },
  ],
  searchFields: ["nom"],
};
