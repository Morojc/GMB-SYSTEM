"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { panier } = useCart();

  const nombreProduits = panier.reduce(
    (total, item) => total + item.quantite,
    0
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold text-green-700"
        >
          GBM
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">

          <Link
            href="/"
            className="hover:text-green-600 transition"
          >
            Accueil
          </Link>

          <Link
            href="/produits"
            className="hover:text-green-600 transition"
          >
            Produits
          </Link>

          <Link
            href="/apropos"
            className="hover:text-green-600 transition"
          >
            À propos
          </Link>

          <Link
            href="/contact"
            className="hover:text-green-600 transition"
          >
            Contact
          </Link>

        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          <Link
            href="/panier"
            className="relative bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            🛒 Panier

            {nombreProduits > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {nombreProduits}
              </span>
            )}
          </Link>

          <Link
            href="/login"
            className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-5 py-2 rounded-lg transition"
          >
            Espace Employé
          </Link>

        </div>

      </div>
    </nav>
  );
}