import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const nbEmployes = await prisma.employe.count();

  const nbClients = await prisma.client.count();

  const nbProduits = await prisma.produit.count();

  const nbCommandes = await prisma.commande.count();

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Employés : {nbEmployes}</p>
      <p>Clients : {nbClients}</p>
      <p>Produits : {nbProduits}</p>
      <p>Commandes : {nbCommandes}</p>
    </div>
  );
}