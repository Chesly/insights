"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

export interface CartItem {
  /** The download's/product's id — doubles as the line-item key. */
  productId: string;
  slug: string;
  name: string;
  thumbnailUrl?: string;
  price: number; // ZAR, snapshot at add-time so a later price change
                  // doesn't retroactively alter something already in cart
  /** 'digital' (default, instant download — the original behaviour) or
      'physical' (ships, tracks stock, needs an address at checkout).
      Drives fulfillment branching in lib/orders.ts — see fulfillOrder. */
  type?: "digital" | "physical";
  /** Which client catalog this came from, e.g. 'primehealthmeds'. Only
      set for physical items; digital Insights downloads leave it unset. */
  site?: string;
  quantity?: number; // defaults to 1 — digital goods stay effectively 1-per-line
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  count: number;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "chesly-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount — guarded so SSR/client markup always matches on
  // first paint (cart is empty server-side, filled in right after).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* corrupt/blocked storage — just start empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full/blocked — cart still works in-memory for this visit */
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (!existing) return [...prev, { quantity: 1, ...item }];
      // Digital goods (no `type`, or 'digital') stay single-line — adding
      // an already-in-cart download is a no-op, same as before. Physical
      // goods bump quantity, since a shopper reasonably wants more than one.
      if (item.type !== "physical") return prev;
      return prev.map((i) => (i.productId === item.productId ? { ...i, quantity: (i.quantity || 1) + 1 } : i));
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const isInCart = useCallback((productId: string) => items.some((i) => i.productId === productId), [items]);

  const count = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, isInCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
