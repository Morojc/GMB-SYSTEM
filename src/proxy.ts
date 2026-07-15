import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// The management dashboard is admin-only.
const adminOnly = ["/dashboard"];
// Routes that require any authenticated user.
const authOnly = ["/panier", "/commande", "/confirmation", "/mes-commande"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAdmin = adminOnly.some((r) => pathname.startsWith(r));
  const isAuth = authOnly.some((r) => pathname.startsWith(r));

  if (!isAdmin && !isAuth) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    const role = payload.role as string | undefined;

    if (isAdmin && role !== "ADMIN") {
      // Authenticated but not an admin → send to the storefront.
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
