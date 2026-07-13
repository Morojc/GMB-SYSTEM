import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe sont obligatoires." },
        { status: 400 }
      );
    }

    const personne = await prisma.personne.findUnique({
      where: {
        email,
      },
      include: {
        client: true,
        employe: true,
      },
    });

    if (!personne) {
      return NextResponse.json(
        { message: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      password
    );

    if (!passwordCorrect) {
      return NextResponse.json(
        { message: "Mot de passe incorrect." },
        { status: 401 }
      );
    }

    const token = generateToken({
      idPersonne: personne.id_personne,
      email: email,
    });

    const response = NextResponse.json({
      message: "Connexion réussie.",
      token,
      user: {
        id: personne.id_personne,
        nom: personne.nom,
        prenom: personne.prenom,
        email: personne.email,
        role: personne.employe
          ? "EMPLOYE"
          : personne.client
          ? "CLIENT"
          : "UNKNOWN",
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}