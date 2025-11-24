// hook usado en CatalogPage.jsx
// src/hooks/useCatalog.js
import { useEffect, useMemo, useState } from "react";
import useProductsData from "@/hooks/useProductsData.js";

const normalize = (p = {}) => {
  const offer = p.oferta ?? p.offer;
  const precioBase = Number(p.precioBase ?? p.precio ?? 0);
  const precio = offer?.onSale ? Number(offer.price ?? p.precio ?? 0) : Number(p.precio ?? 0);
  return {
    id: p.id ?? "",
    nombre: p.nombre ?? "Producto",
    categoria: p.categoria ?? "Sin categoria",
    precio,
    precioBase,
    oferta: offer,
    stock: Number(p.stock ?? 0),
    imagen: p.imagen || "/src/assets/img/placeholder.png",
  };
};

const uniqueCats = (arr) =>
  Array.from(new Set(arr.map((p) => p.categoria).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "es")
  );

export function useCatalog({ pageSize = 12, initialQ = "" } = {}) {
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState("");
  const [page, setPage] = useState(1);
  const rawProducts = useProductsData();

  const all = useMemo(
    () =>
      (rawProducts ?? [])
        .map(normalize)
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    [rawProducts]
  );

  const categorias = useMemo(() => uniqueCats(all), [all]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return all.filter((p) => {
      const okTerm =
        !term ||
        p.nombre.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term);
      const okCat = !cat || p.categoria === cat;
      return okTerm && okCat;
    });
  }, [all, q, cat]);

  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));

  const items = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // reset página cuando cambian los filtros
  useEffect(() => setPage(1), [q, cat]);

  const clearFilters = () => {
    setQ("");
    setCat("");
  };

  return {
    state: { q, cat, page },
    data: { categorias, items, maxPage, total: filtered.length },
    actions: { setQ, setCat, setPage, clearFilters },
  };
}
