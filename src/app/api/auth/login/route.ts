import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.personne.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password,password);

    if (!valid) {
      return NextResponse.json(
        { message: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Connexion réussie",
      user,
    });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}