"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  nom: string;
  prix: number;
}

export default function AddToCartButton({
  id,
  nom,
  prix,
}: Props) {
  const { addToCart } = useCart();
  const router = useRouter();

  function handleAdd() {
    addToCart({
      id,
      nom,
      prix,
      quantite: 1,
    });

    alert("Produit ajouté au panier !");
  }

  return (
    <button
      onClick={handleAdd}
      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
    >
      Ajouter au panier
    </button>
  );
}