import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const personne = await prisma.personne.findUnique({
      where: {
        email,
      },
      include: {
        client: true,
      },
    });

    if (!personne || !personne.client) {
      return NextResponse.json(
        {
          message: "Email ou mot de passe incorrect.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      personne.password!
    );

    if (!passwordCorrect) {
      return NextResponse.json(
        {
          message: "Email ou mot de passe incorrect.",
        },
        {
          status: 401,
        }
      );
    }

    const token = generateToken({
      idPersonne: personne.id_personne,
      email: personne.email!,
    });

    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie.",
    });

   response.cookies.set("client_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
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