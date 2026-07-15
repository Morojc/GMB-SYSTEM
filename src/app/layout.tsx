import type { Metadata } from "next";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "GMB — Grande Minoterie",
  description: "Système de gestion pour minoterie et distribution alimentaire",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}