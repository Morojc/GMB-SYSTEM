import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("client_token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  try {
    verifyToken(token);

    return NextResponse.json({
      authenticated: true,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}