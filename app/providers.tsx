"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalItems: number;
  subtotalCents: number;
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "compia_cart_v1";

function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const value = useMemo<CartState>(() => {
    const addItem: CartState["addItem"] = (item, qty = 1) => {
      const q = clampInt(qty, 1, 99);
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.productId === item.productId);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: clampInt(copy[idx].qty + q, 1, 99) };
          return copy;
        }
        return [...prev, { ...item, qty: q }];
      });
    };

    const removeItem: CartState["removeItem"] = (productId) => {
      setItems((prev) => prev.filter((p) => p.productId !== productId));
    };

    const setQty: CartState["setQty"] = (productId, qty) => {
      const q = clampInt(qty, 1, 99);
      setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, qty: q } : p)));
    };

    const clear = () => setItems([]);

    const totalItems = items.reduce((acc, it) => acc + it.qty, 0);
    const subtotalCents = items.reduce((acc, it) => acc + it.unitPriceCents * it.qty, 0);

    return { items, addItem, removeItem, setQty, clear, totalItems, subtotalCents };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
