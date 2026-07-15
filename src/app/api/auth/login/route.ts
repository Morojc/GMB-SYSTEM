import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { resolveRole } from "@/lib/roles";

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
      where: { email },
      include: {
        client: true,
        employe: { include: { role_employe: true } },
      },
    });

    if (!personne || !personne.password) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    const passwordCorrect = await bcrypt.compare(password, personne.password);

    if (!passwordCorrect) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    const role = resolveRole(personne);
    const token = generateToken({
      idPersonne: personne.id_personne,
      email,
      role,
    });

    const response = NextResponse.json({
      message: "Connexion réussie.",
      user: {
        id: personne.id_personne,
        nom: personne.nom,
        prenom: personne.prenom,
        email,
        role,
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
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
