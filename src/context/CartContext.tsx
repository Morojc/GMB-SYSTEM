"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
}

interface CartContextType {
  panier: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [panier, setPanier] = useState<CartItem[]>([]);

  function addToCart(item: CartItem) {
    const exist = panier.find((p) => p.id === item.id);

    if (exist) {
      setPanier(
        panier.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantite: p.quantite + 1,
              }
            : p
        )
      );
    } else {
      setPanier([...panier, item]);
    }
  }

  function removeFromCart(id: number) {
    setPanier(panier.filter((p) => p.id !== id));
  }

  function clearCart() {
    setPanier([]);
  }

  return (
    <CartContext.Provider
      value={{
        panier,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}