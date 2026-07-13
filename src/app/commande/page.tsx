"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CommandePage() {
  const router = useRouter();

  const { panier, clearCart } = useCart();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [paiement, setPaiement] = useState("Paiement à la livraison");

  const total = panier.reduce(
    (sum, p) => sum + p.prix * p.quantite,
    0
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (panier.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    const response = await fetch("/api/commande", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom,
        email,
        telephone,
        adresse,
        paiement,
        panier,
      }),
    });

    if (!response.ok) {
      alert("Erreur lors de la commande.");
      return;
    }

    clearCart();

    router.push("/confirmation");
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Passer la commande
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            type="text"
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            placeholder="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <textarea
            placeholder="Adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="w-full border rounded-lg p-3"
            rows={4}
            required
          />

          <select
            value={paiement}
            onChange={(e) => setPaiement(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option>Paiement à la livraison</option>
            <option>Carte bancaire</option>
            <option>Virement bancaire</option>
          </select>

          <div className="bg-gray-100 rounded-xl p-5">

            <h2 className="text-2xl font-bold mb-4">
              Résumé
            </h2>

            {panier.map((item) => (
              <div
                key={item.id}
                className="flex justify-between mb-2"
              >
                <span>
                  {item.nom} × {item.quantite}
                </span>

                <span>
                  {(item.prix * item.quantite).toFixed(2)} DH
                </span>
              </div>
            ))}

            <hr className="my-4" />

            <div className="flex justify-between text-2xl font-bold text-green-600">

              <span>Total</span>

              <span>{total.toFixed(2)} DH</span>

            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Confirmer la commande
          </button>

        </form>

      </div>

    </main>
  );
}