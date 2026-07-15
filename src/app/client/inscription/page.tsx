"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InscriptionClientPage() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const response = await fetch("/api/client/inscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom,
        prenom,
        email,
        telephone,
        adresse,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Inscription réussie.");

    router.push("/client/login");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">

        <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
          Inscription Client
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
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
          />

          <textarea
            placeholder="Adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="w-full border rounded-lg p-3"
            rows={3}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
          >
            S&apos;inscrire
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Déjà un compte ?
          <Link
            href="/client/login"
            className="text-green-600 font-semibold ml-2 hover:underline"
          >
            Se connecter
          </Link>
        </p>

      </div>

    </main>
  );
}