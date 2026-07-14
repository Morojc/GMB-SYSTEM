import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      adresse,
      password,
    } = await req.json();

    // Vérifier si l'email existe déjà
    const existe = await prisma.personne.findUnique({
      where: {
        email,
      },
    });

    if (existe) {
      return NextResponse.json(
        {
          message: "Cet email est déjà utilisé.",
        },
        {
          status: 400,
        }
      );
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de la personne
    const personne = await prisma.personne.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        adresse,
        password: hashedPassword,
      },
    });

    // Création du client
    await prisma.client.create({
      data: {
        id_personne: personne.id_personne,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Inscription réussie.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Erreur serveur.",
      },
      {
        status: 500,
      }
    );
  }
}