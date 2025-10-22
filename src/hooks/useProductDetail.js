// usado por ProductDetailPage.jsx
// src/hooks/useProductDetail.js
import { useEffect, useMemo, useState } from "react";
import productsData from "@/data/productos.json";
import { addItem, getAvailableStock } from "@/lib/cartStore";
import { resolveImg } from "@/utils/resolveImg";

const PLACEHOLDER = "/src/assets/img/tienda/productos/poke-Ball.png";
const MAX_QTY = 99;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function useProductDetail(productId) {
  const raw = Array.isArray(productsData) ? productsData : [];

  const all = useMemo(
    () =>
      raw.map((p) => ({
        id: p.id ?? "",
        nombre: p.nombre ?? "Producto",
        categoria: p.categoria ?? "—",
        precio: Number(p.precio ?? 0),
        stock: Number(p.stock ?? 0),
        imagen: p.imagen || "",
        descripcion:
          p.descripcion ||
          "Este producto forma parte del catálogo de Poké Mart. Pronto añadiremos una descripción más detallada.",
      })),
    [raw]
  );

  const product = useMemo(
    () => all.find((x) => String(x.id) === String(productId)) || null,
    [all, productId]
  );

  // Galería (4 slots)
  const gallery = useMemo(() => {
    if (!product) return [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];
    const imgs = [resolveImg(product.imagen)];
    while (imgs.length < 4) imgs.push(PLACEHOLDER);
    return imgs;
  }, [product]);

  const [mainSrc, setMainSrc] = useState(gallery[0]);
  useEffect(() => setMainSrc(gallery[0]), [gallery]);

  // Stock disponible segun carrito
  const computeAvailable = (p) => getAvailableStock(String(p?.id ?? ""), Number(p?.stock ?? 0));
  const [available, setAvailable] = useState(product ? computeAvailable(product) : 0);

  useEffect(() => {
    if (product) setAvailable(computeAvailable(product));
  }, [product]);

  useEffect(() => {
    const handler = () => product && setAvailable(computeAvailable(product));
    window.addEventListener("cart:updated", handler);
    return () => window.removeEventListener("cart:updated", handler);
  }, [product]);

  const [qty, setQty] = useState(1);

  const addToCart = () => {
    if (!product || available <= 0) return;
    const desired = clamp(parseInt(qty || 1, 10), 1, MAX_QTY);
    const amount = Math.min(desired, available);
    if (amount <= 0) return;

    const res = addItem(product, amount);
    const nextAvail =
      typeof res?.available === "number" ? Math.max(0, res.available) : computeAvailable(product);
    setAvailable(nextAvail);
    setQty(nextAvail === 0 ? 0 : 1);
  };

  const related = useMemo(() => {
    if (!product) return [];
    return all.filter((x) => x.categoria === product.categoria && x.id !== product.id).slice(0, 4);
  }, [all, product]);

  return {
    product,
    gallery,
    mainSrc,
    setMainSrc,
    available,
    qty,
    setQty,
    addToCart,
    related,
  };
}
