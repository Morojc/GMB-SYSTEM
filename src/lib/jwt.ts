import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export type Role = "ADMIN" | "EMPLOYE" | "CLIENT";

export interface JwtPayload {
  idPersonne: number;
  email: string;
  role: Role;
}

export function generateToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}