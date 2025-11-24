// hook usado en CartPage.jsx
// src/hooks/useCartViewModel.js
import { useCallback, useEffect, useMemo, useState } from "react";
import * as cartStore from "@/lib/cartStore";
import useProductsData from "@/hooks/useProductsData.js";
import { resolveImg } from "@/utils/resolveImg";

const SHIPPING_THRESHOLD = 1000;
const SHIPPING_COST = 4990;
const FALLBACK_IMAGE = "/src/assets/img/tienda/productos/poke-Ball.png";

const clamp = (value, min, max) => {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(min, Math.min(max, n));
};

export function useCartViewModel() {
  const [items, setItems] = useState([]);
  const products = useProductsData();

  const catalog = useMemo(
    () => new Map((products ?? []).map((p) => [String(p.id), p])),
    [products]
  );

  const syncState = useCallback(() => {
    const cart = cartStore.getCart();
    const enriched = cart.map((raw) => {
      const id = String(raw.id);
      const prod = catalog.get(id) || null;

      const price = Number(raw.price ?? prod?.precio ?? 0);
      const stock = Number(prod?.stock ?? raw.stock ?? raw.qty ?? 0);
      const name = prod?.nombre ?? raw.name ?? "Producto";
      const srcImage = prod?.imagen ?? raw.image ?? "";
      const image = srcImage ? resolveImg(srcImage) : FALLBACK_IMAGE;
      const descripcion = prod?.descripcion ?? "";

      return {
        id,
        qty: Number(raw.qty ?? 0),
        price,
        stock,
        name,
        image,
        descripcion,
        product: prod,
        _offer: raw._offer ?? null,
      };
    });
    setItems(enriched);
  }, [catalog]);

  useEffect(() => {
    syncState();
    const onCart = () => syncState();
    window.addEventListener("cart:updated", onCart);
    return () => window.removeEventListener("cart:updated", onCart);
  }, [syncState]);

  // Totales derivados
  const totalItems = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.qty * it.price, 0),
    [items]
  );
  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  }, [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  // Acciones
  const setQty = useCallback((id, next, stock) => {
    cartStore.setItemQty(id, next, stock);
    syncState();
  }, [syncState]);

  const inc = useCallback((id) => {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const max = Math.max(it.stock || 0, it.qty || 0);
    const next = clamp(it.qty + 1, 0, max);
    setQty(id, next, it.stock);
  }, [items, setQty]);

  const dec = useCallback((id) => {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const max = Math.max(it.stock || 0, it.qty || 0);
    const next = clamp(it.qty - 1, 0, max);
    setQty(id, next, it.stock);
  }, [items, setQty]);

  const changeQty = useCallback((id, value) => {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const max = Math.max(it.stock || 0, it.qty || 0);
    const next = clamp(parseInt(value, 10), 0, max);
    setQty(id, next, it.stock);
  }, [items, setQty]);

  const remove = useCallback((id) => {
    cartStore.removeItem(id);
    syncState();
  }, [syncState]);

  const clear = useCallback(() => {
    if (!items.length) return;
    cartStore.clearCart();
    syncState();
  }, [items.length, syncState]);

  return {
    items,
    totals: { totalItems, subtotal, shipping, total },
    shippingConfig: { SHIPPING_THRESHOLD, SHIPPING_COST },
    actions: { inc, dec, changeQty, remove, clear },
  };
}
