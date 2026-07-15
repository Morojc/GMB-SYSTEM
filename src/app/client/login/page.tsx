"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    const role = data.user?.role;
    router.push(role === "ADMIN" || role === "EMPLOYE" ? "/dashboard" : "/panier");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
          Connexion Client
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
          >
            Se connecter
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Pas encore de compte ?

          <Link
            href="/client/inscription"
            className="text-green-600 font-semibold ml-2 hover:underline"
          >
            S&apos;inscrire
          </Link>
        </p>

      </div>

    </main>
  );
}