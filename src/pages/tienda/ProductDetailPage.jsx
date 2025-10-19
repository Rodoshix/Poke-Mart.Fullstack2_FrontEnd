// src/pages/tienda/ProductDetailPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import productsData from "@/data/productos.json";
import reviewsData from "@/data/reviews.json";
import { RelatedProducts } from "@/components/catalog/RelatedProducts.jsx";
import { Reviews } from "@/components/reviews/Reviews.jsx";
import "@/assets/styles/product-detail.css";

import { addItem, getAvailableStock } from "@/lib/cartStore";

const PLACEHOLDER = "/src/assets/img/tienda/productos/poke-Ball.png";

const resolveImg = (path) => {
  let clean = String(path ?? "").trim();
  if (!clean) return PLACEHOLDER;
  if (/^https?:\/\//i.test(clean)) return clean;
  clean = clean.replace(/^(?:\.\/|\.\.\/)+/, "").replace(/^\/+/, "");
  if (/^src\/assets\//.test(clean)) return `/${clean}`;
  if (/^(tienda|img|assets\/img)\//.test(clean)) {
    clean = `src/assets/${clean.replace(/^assets\//, "")}`;
    return `/${clean}`;
  }
  return `/src/assets/img/${clean}`;
};

const money = (n) => `$${Number(n ?? 0).toLocaleString("es-CL")}`;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function ProductDetailPage() {
  const { id } = useParams();

  const rawProducts = productsData ?? [];
  const all = useMemo(
    () =>
      rawProducts.map((p) => ({
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
    [rawProducts]
  );

  const product = useMemo(
    () => all.find((x) => String(x.id) === String(id)),
    [all, id]
  );

  const reviewKey = useMemo(() => {
    const idx = rawProducts.findIndex((p) => String(p.id) === String(id));
    return idx >= 0 ? String(idx + 1) : null;
  }, [rawProducts, id]);

  const gallery = useMemo(() => {
    if (!product) return [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];
    const imgs = [resolveImg(product.imagen)];
    while (imgs.length < 4) imgs.push(PLACEHOLDER);
    return imgs;
  }, [product]);
  const [mainSrc, setMainSrc] = useState(gallery[0]);
  useEffect(() => setMainSrc(gallery[0]), [gallery]);

  // Stock disponible (NO mutar product.stock)
  const computeAvailable = (p) =>
    getAvailableStock(String(p?.id ?? ""), Number(p?.stock ?? 0));

  const [available, setAvailable] = useState(product ? computeAvailable(product) : 0);
  useEffect(() => {
    if (product) setAvailable(computeAvailable(product));
  }, [product]);

  useEffect(() => {
    const handler = () => {
      if (product) setAvailable(computeAvailable(product));
    };
    window.addEventListener("cart:updated", handler);
    return () => window.removeEventListener("cart:updated", handler);
  }, [product]);
  const [qty, setQty] = useState(1);
  const MAX_QTY = 99;

  const addToCart = () => {
    if (!product || available <= 0) return;
    const desired = clamp(parseInt(qty || 1, 10), 1, MAX_QTY);
    const amount = Math.min(desired, available);

    if (amount <= 0) return;

    const res = addItem(product, amount);

    const nextAvail =
      typeof res?.available === "number"
        ? Math.max(0, res.available)
        : computeAvailable(product);

    setAvailable(nextAvail);
    setQty(nextAvail === 0 ? 0 : 1);
  };

  const related = useMemo(() => {
    if (!product) return [];
    return all
      .filter((x) => x.categoria === product.categoria && x.id !== product.id)
      .slice(0, 4);
  }, [all, product]);

  const reviews = useMemo(() => {
    if (!reviewKey) return [];
    const raw =
      reviewsData && typeof reviewsData === "object"
        ? reviewsData[reviewKey] ?? []
        : [];
    return Array.isArray(raw) ? raw : [];
  }, [reviewKey]);

  if (!product) {
    return (
      <main className="container py-5">
        <h2 className="mb-2">Ups…</h2>
        <p className="text-secondary">Producto no encontrado.</p>
        <Link className="btn btn-primary" to="/catalogo">
          Volver a productos
        </Link>
      </main>
    );
  }

  return (
    <>
      <img
        src="/src/assets/img/background-logo.png"
        className="left-border"
        alt=""
        aria-hidden="true"
      />
      <img
        src="/src/assets/img/background-logo.png"
        className="right-border"
        alt=""
        aria-hidden="true"
      />

      <main className="site-main container my-4 flex-grow-1">
        <nav className="breadcrumb-wrapper mb-3" aria-label="Breadcrumb">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/catalogo">Productos</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.nombre}
            </li>
          </ol>
        </nav>

        <section className="product row g-4">
          <div className="product__gallery col-12 col-lg-7">
            <div className="product-gallery card">
              <div className="product-gallery__main ratio ratio-4x3">
                <img
                  className="product-gallery__img"
                  src={mainSrc}
                  alt={product.nombre}
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                />
              </div>
              <div className="product-gallery__thumbs d-flex gap-2 p-3 border-top">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`thumb ${src === mainSrc ? "thumb--active" : ""}`}
                    onClick={() => setMainSrc(src)}
                    aria-label={`miniatura ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt=""
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="product__info col-12 col-lg-5">
            <h1 className="h3 mb-2">{product.nombre}</h1>
            <div className="h4 text-primary mb-3">{money(product.precio)}</div>

            <p className="product__desc text-secondary">{product.descripcion}</p>

            <div className="product__buy d-flex align-items-center gap-2 my-3">
              <label htmlFor="qty" className="form-label m-0">
                Cantidad
              </label>
              <input
                id="qty"
                type="number"
                min={available > 0 ? 1 : 0}
                max={Math.min(available, MAX_QTY)}
                value={available > 0 ? qty : 0}
                disabled={available <= 0}
                onChange={(e) => {
                  const raw = parseInt(e.target.value || "0", 10);
                  const next = clamp(raw, available > 0 ? 1 : 0, Math.min(available, MAX_QTY));
                  setQty(next);
                }}
                className="form-control"
                style={{ maxWidth: "100px" }}
              />
              <button
                className={`btn flex-grow-1 ${available > 0 ? "btn-primary" : "btn-outline-secondary"}`}
                disabled={available <= 0}
                onClick={addToCart}
              >
                {available > 0 ? "Añadir al carrito" : "Sin stock"}
              </button>
            </div>
            <div className="small text-muted">Stock: {available}</div>
          </aside>
        </section>

        <RelatedProducts items={related} />
        <Reviews reviews={reviews} />
      </main>
    </>
  );
}
