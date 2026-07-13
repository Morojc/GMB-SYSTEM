import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    const client = await prisma.client.findUnique({
      where: {
        id_personne: payload.idPersonne,
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: "Client introuvable" },
        { status: 404 }
      );
    }

    const { panier } = await req.json();

    if (!panier || panier.length === 0) {
      return NextResponse.json(
        { message: "Panier vide" },
        { status: 400 }
      );
    }

    const commande = await prisma.commande.create({
      data: {
        id_client: client.id_client,
        date_commande: new Date(),
        statut: "En attente",
      },
    });

    for (const item of panier) {
      await prisma.ligne_commande.create({
        data: {
          id_commande: commande.id_commande,
          id_produit: item.id,
          quantite: item.quantite,
          prix_unitaire: item.prix,
        },
      });
    }

    return NextResponse.json({
      success: true,
      id_commande: commande.id_commande,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}