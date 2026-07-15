import type { ResourceConfig, ResourceGroup } from "./types";
import { produit } from "./produit";
import { typeProduit } from "./type_produit";
import { client } from "./client";
import { employe } from "./employe";
import { commande } from "./commande";
import { stock } from "./stock";
import { zoneStock } from "./zone_stock";

/**
 * Central registry of every CRUD resource. Order here defines the order
 * within each sidebar group.
 */
const REGISTRY: ResourceConfig[] = [
  // Commercial
  client,
  commande,
  // Production
  produit,
  typeProduit,
  // Inventaire
  stock,
  zoneStock,
  // RH
  employe,
];

export function allResources(): ResourceConfig[] {
  return REGISTRY;
}

export function getResource(key: string): ResourceConfig {
  const found = REGISTRY.find((r) => r.key === key);
  if (!found) throw new Error(`Unknown resource: ${key}`);
  return found;
}

const GROUP_ORDER: ResourceGroup[] = [
  "Commercial",
  "Production",
  "Inventaire",
  "RH",
  "Système",
];

export function navGroups(): { group: ResourceGroup; items: ResourceConfig[] }[] {
  return GROUP_ORDER.map((group) => ({
    group,
    items: REGISTRY.filter((r) => r.group === group),
  })).filter((g) => g.items.length > 0);
}
