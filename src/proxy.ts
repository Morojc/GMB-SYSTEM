import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// Routes that require staff (ADMIN or EMPLOYE).
const staffOnly = ["/dashboard"];
// Routes that require any authenticated user.
const authOnly = ["/panier", "/commande", "/confirmation", "/mes-commande"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isStaff = staffOnly.some((r) => pathname.startsWith(r));
  const isAuth = authOnly.some((r) => pathname.startsWith(r));

  if (!isStaff && !isAuth) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    const role = payload.role as string | undefined;

    if (isStaff && role !== "ADMIN" && role !== "EMPLOYE") {
      return NextResponse.redirect(new URL("/produits", request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/panier/:path*",
    "/commande/:path*",
    "/confirmation/:path*",
    "/mes-commande/:path*",
  ],
};
