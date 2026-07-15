/**
 * Additive, idempotent seed. Never deletes existing rows — it only creates
 * records that are missing. Safe to run repeatedly.
 *
 *   npm run seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Find the first row matching `where`, or create it from `data`. */
async function ensure<T>(
  find: () => Promise<T | null>,
  create: () => Promise<T>
): Promise<T> {
  const existing = await find();
  if (existing) return existing;
  return create();
}

async function main() {
  // ---- Roles --------------------------------------------------------------
  const adminRole = await ensure(
    () => prisma.role_employe.findFirst({ where: { nom_role: "Admin" } }),
    () =>
      prisma.role_employe.create({
        data: { nom_role: "Admin", tache: "Administration du système" },
      })
  );
  const meunierRole = await ensure(
    () => prisma.role_employe.findFirst({ where: { nom_role: "Meunier" } }),
    () =>
      prisma.role_employe.create({
        data: { nom_role: "Meunier", tache: "Production de la farine" },
      })
  );

  // ---- Admin account ------------------------------------------------------
  const adminEmail = "admin@gmb.local";
  const adminPersonne = await prisma.personne.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nom: "Admin",
      prenom: "GMB",
      email: adminEmail,
      telephone: "0600000000",
      adresse: "Siège GMB",
      password: await bcrypt.hash("Admin123!", 10),
    },
  });
  await ensure(
    () => prisma.employe.findFirst({ where: { id_personne: adminPersonne.id_personne } }),
    () =>
      prisma.employe.create({
        data: {
          id_personne: adminPersonne.id_personne,
          id_role: adminRole.id_role,
          date_embauche: new Date("2024-01-01"),
        },
      })
  );

  // ---- A regular employee -------------------------------------------------
  const empPersonne = await prisma.personne.upsert({
    where: { email: "meunier@gmb.local" },
    update: {},
    create: {
      nom: "Bennani",
      prenom: "Youssef",
      email: "meunier@gmb.local",
      telephone: "0611111111",
      password: await bcrypt.hash("Meunier123!", 10),
    },
  });
  await ensure(
    () => prisma.employe.findFirst({ where: { id_personne: empPersonne.id_personne } }),
    () =>
      prisma.employe.create({
        data: {
          id_personne: empPersonne.id_personne,
          id_role: meunierRole.id_role,
          date_embauche: new Date("2024-06-15"),
        },
      })
  );

  // ---- Product types ------------------------------------------------------
  const typeFarine = await ensure(
    () => prisma.type_produit.findFirst({ where: { nom_type: "Farine" } }),
    () => prisma.type_produit.create({ data: { nom_type: "Farine" } })
  );
  const typeSemoule = await ensure(
    () => prisma.type_produit.findFirst({ where: { nom_type: "Semoule" } }),
    () => prisma.type_produit.create({ data: { nom_type: "Semoule" } })
  );

  // ---- Products -----------------------------------------------------------
  const products = [
    { nom: "Farine de blé T55 (25kg)", prix: 180, quantite_stock: 120, id_type: typeFarine.id_type },
    { nom: "Farine complète (25kg)", prix: 210, quantite_stock: 8, id_type: typeFarine.id_type },
    { nom: "Semoule fine (10kg)", prix: 95, quantite_stock: 3, id_type: typeSemoule.id_type },
    { nom: "Semoule grosse (10kg)", prix: 92, quantite_stock: 60, id_type: typeSemoule.id_type },
  ];
  for (const p of products) {
    await ensure(
      () => prisma.produit.findFirst({ where: { nom: p.nom } }),
      () => prisma.produit.create({ data: p })
    );
  }

  // ---- Zones & silos ------------------------------------------------------
  await ensure(
    () => prisma.zone_stock.findFirst({ where: { nom: "Entrepôt A" } }),
    () => prisma.zone_stock.create({ data: { nom: "Entrepôt A", capacite: 1000 } })
  );
  const silo = await ensure(
    () => prisma.silon.findFirst({ where: { nom: "Silo 1" } }),
    () => prisma.silon.create({ data: { nom: "Silo 1", capacite: 5000 } })
  );

  // ---- Raw material (wheat) in the silo ----------------------------------
  const ble = await ensure(
    () => prisma.matiere_premiere.findFirst({ where: { nom: "Blé tendre" } }),
    () =>
      prisma.matiere_premiere.create({
        data: { nom: "Blé tendre", quantite: 8000, id_silon: silo.id_silon },
      })
  );

  // ---- Procurement: a supplier + a purchase order (Commandé) --------------
  const coop = await ensure(
    () => prisma.fournisseur.findFirst({ where: { nom: "Coopérative Blé du Saïss" } }),
    () =>
      prisma.fournisseur.create({
        data: {
          nom: "Coopérative Blé du Saïss",
          telephone: "0655555555",
          email: "contact@ble-saiss.ma",
          adresse: "Meknès",
        },
      })
  );
  const nbAchats = await prisma.achat.count();
  if (nbAchats === 0) {
    const cmdAchat = await prisma.achat.create({
      data: {
        id_fournisseur: coop.id_fournisseur,
        date_achat: new Date(),
        statut: "Commandé",
      },
    });
    await prisma.ligne_achat.create({
      data: {
        id_achat: cmdAchat.id_achat,
        id_matiere: ble.id_matiere,
        quantite: 2000,
        prix_unitaire: 4.5,
      },
    });
  }

  // ---- Production: one finished fabrication run --------------------------
  const nbFab = await prisma.fabrication.count();
  if (nbFab === 0) {
    const farine = await prisma.produit.findFirst({ where: { nom: { contains: "T55" } } });
    const fab = await prisma.fabrication.create({
      data: { date_fabrication: new Date(), statut: "Terminée", note: "Lot de démonstration" },
    });
    await prisma.fabrication_intrant.create({
      data: { id_fabrication: fab.id_fabrication, id_matiere: ble.id_matiere, quantite: 1000 },
    });
    if (farine) {
      await prisma.fabrication_produit.create({
        data: { id_fabrication: fab.id_fabrication, id_produit: farine.id_produit, quantite: 780 },
      });
    }
  }

  // ---- Sample clients -----------------------------------------------------
  const clientPersonnes = [
    { nom: "Alaoui", prenom: "Sara", email: "sara.alaoui@example.com", telephone: "0622222222" },
    { nom: "Idrissi", prenom: "Karim", email: "karim.idrissi@example.com", telephone: "0633333333" },
  ];
  const clients = [];
  for (const cp of clientPersonnes) {
    const personne = await prisma.personne.upsert({
      where: { email: cp.email },
      update: {},
      create: { ...cp, password: await bcrypt.hash("Client123!", 10) },
    });
    const client = await ensure(
      () => prisma.client.findFirst({ where: { id_personne: personne.id_personne } }),
      () => prisma.client.create({ data: { id_personne: personne.id_personne } })
    );
    clients.push(client);
  }

  // ---- Sample orders ------------------------------------------------------
  const existingOrders = await prisma.commande.count();
  if (existingOrders === 0) {
    const farine = await prisma.produit.findFirst({ where: { nom: { contains: "T55" } } });
    const cmd = await prisma.commande.create({
      data: {
        id_client: clients[0].id_client,
        date_commande: new Date(),
        statut: "En attente",
      },
    });
    if (farine) {
      await prisma.ligne_commande.create({
        data: {
          id_commande: cmd.id_commande,
          id_produit: farine.id_produit,
          quantite: 5,
          prix_unitaire: farine.prix,
        },
      });
      await prisma.facture.create({
        data: {
          id_commande: cmd.id_commande,
          date_facture: new Date(),
          montant: Number(farine.prix) * 5,
        },
      });
    }
  }

  console.log("Seed done ✔  Admin: admin@gmb.local / Admin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
