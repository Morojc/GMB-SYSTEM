import type { ResourceConfig, ResourceGroup } from "./types";
import { produit } from "./produit";
import { typeProduit } from "./type_produit";
import { client } from "./client";
import { employe } from "./employe";
import { commande } from "./commande";
import { stock } from "./stock";
import { zoneStock } from "./zone_stock";
import {
  ligneCommande,
  facture,
  bonCommande,
  livreur,
  livraison,
  bonLivraison,
} from "./commercial";
import { silon, matierePremiere, catalogue, catalogueProduit } from "./production";
import { personne, roleEmploye, salaire } from "./rh";
import { fournisseur, achat, ligneAchat, factureAchat } from "./approvisionnement";
import { fabrication, fabricationIntrant, fabricationProduit } from "./fabrication";

/**
 * Central registry of every CRUD resource. Order here defines the order
 * within each sidebar group, and follows the mill cycle:
 * Approvisionnement → Production → Stock → Ventes → RH → Système.
 */
const REGISTRY: ResourceConfig[] = [
  // Approvisionnement (buy wheat / raw material)
  fournisseur,
  achat,
  ligneAchat,
  factureAchat,
  // Production (mill wheat into finished products)
  fabrication,
  fabricationIntrant,
  fabricationProduit,
  produit,
  typeProduit,
  matierePremiere,
  silon,
  catalogue,
  catalogueProduit,
  // Stock (finished goods)
  stock,
  zoneStock,
  // Ventes (sell & bill clients)
  client,
  commande,
  ligneCommande,
  facture,
  bonCommande,
  livraison,
  bonLivraison,
  livreur,
  // RH
  employe,
  roleEmploye,
  salaire,
  // Système
  personne,
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
  "Approvisionnement",
  "Production",
  "Stock",
  "Ventes",
  "RH",
  "Système",
];

export function navGroups(): { group: ResourceGroup; items: ResourceConfig[] }[] {
  return GROUP_ORDER.map((group) => ({
    group,
    items: REGISTRY.filter((r) => r.group === group),
  })).filter((g) => g.items.length > 0);
}
