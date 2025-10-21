// src/pages/tienda/OffersPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import productsData from "@/data/productos.json";
import offersData from "@/data/ofertas.json"; // overlay de campañas
import * as cartStore from "@/lib/cartStore";
import { getOfferInfo } from "@/lib/offers";

import "@/assets/styles/ofertas.css";

const FALLBACK = "/src/assets/img/tienda/productos/poke-Ball.png";

const resolveImg = (path) => {
  let clean = String(path ?? "").trim();
  if (!clean) return FALLBACK;
  if (/^https?:\/\//i.test(clean)) return clean;
  clean = clean.replace(/^(?:\.\/|\.\.\/)+/, "").replace(/^\/+/, "");
  if (/^src\/assets\//i.test(clean)) return `/${clean}`;
  if (/^(tienda|img|assets\/img)\//i.test(clean)) {
    clean = `src/assets/${clean.replace(/^assets\//i, "")}`;
    return `/${clean}`;
  }
  return `/src/assets/img/${clean}`;
};

const money = (v) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(v ?? 0);

const badge = (pct) =>
  pct >= 5 ? (
    <span className="offer-badge" aria-label={`Descuento ${pct}%`}>-{pct}%</span>
  ) : null;

const formatCountdown = (ms) => {
  if (ms == null) return "";
  if (ms <= 0) return "Terminado";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`;
};

export default function OffersPage() {
  useEffect(() => {
    document.body.classList.add("page--ofertas");
    return () => document.body.classList.remove("page--ofertas");
  }, []);

  // Map de overlay por id
  const overlayById = useMemo(() => {
    const list = Array.isArray(offersData) ? offersData : [];
    return new Map(list.map((o) => [String(o.id), o]));
  }, []);

  const allOffers = useMemo(() => {
    const raw = Array.isArray(productsData) ? productsData : [];
    return raw
      .map((p) => {
        const offer = getOfferInfo(p, overlayById);
        const stock = Number(p.stock ?? 0);
        return {
          ...p,
          stock,
          img: resolveImg(p.imagen),
          offer,
        };
      })
      .filter((p) => p.offer.onSale);
  }, [overlayById]);

  // Orden
  const [sort, setSort] = useState("best");
  const sorted = useMemo(() => {
    const copy = allOffers.slice();
    if (sort === "priceAsc") copy.sort((a, b) => a.offer.price - b.offer.price);
    else if (sort === "priceDesc") copy.sort((a, b) => b.offer.price - a.offer.price);
    else if (sort === "ending") {
      const val = (x) => (x.offer.expiresInMs == null ? Number.POSITIVE_INFINITY : x.offer.expiresInMs);
      copy.sort((a, b) => val(a) - val(b));
    } else {
      copy.sort((a, b) => b.offer.discountPct - a.offer.discountPct);
    }
    return copy;
  }, [allOffers, sort]);

  const add = (p) => {
    const max = cartStore.getAvailableStock(String(p.id), Number(p.stock ?? 0));
    if (max <= 0) return;
    cartStore.addItem(
      {
        id: p.id,
        nombre: p.nombre,
        precio: p.offer.price,
        imagen: p.imagen,
        stock: p.stock,
      },
      1
    );
  };

  if (!sorted.length) {
    return (
      <main className="site-main container py-5">
        <h1 className="h3 mb-3">Ofertas</h1>
        <div className="alert alert-info">Por ahora no hay productos en oferta.</div>
        <Link className="btn btn-primary mt-2" to="/catalogo">
          Ir al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="site-main container py-4">
      <header className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">Ofertas</h1>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="sort" className="form-label m-0 me-1">
            Ordenar por
          </label>
          <select
            id="sort"
            className="form-select form-select-sm"
            style={{ width: 220 }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="best">Mayor descuento</option>
            <option value="priceAsc">Precio: menor a mayor</option>
            <option value="priceDesc">Precio: mayor a menor</option>
            <option value="ending">Terminan antes</option>
          </select>
        </div>
      </header>

      <section className="row g-3">
        {sorted.map((p) => {
          const endsLabel =
            p.offer.endsAt && p.offer.expiresInMs != null
              ? `Termina en ${formatCountdown(p.offer.expiresInMs)}`
              : "";

          const out = p.stock <= 0;

          return (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <article className="offer-card h-100">
                <div className="offer-card__media">
                  <img
                    className="offer-card__img"
                    src={p.img}
                    alt={p.nombre}
                    onError={(e) => (e.currentTarget.src = FALLBACK)}
                  />
                  {badge(p.offer.discountPct)}
                </div>

                <div className="offer-card__body">
                  <h3 className="offer-card__title" title={p.nombre}>
                    {p.nombre}
                  </h3>

                  <div className="offer-card__prices">
                    <span className="offer-card__price">{money(p.offer.price)}</span>
                    <span className="offer-card__base">{money(p.offer.basePrice)}</span>
                  </div>

                  {endsLabel ? (
                    <div className="offer-card__ends text-secondary small">{endsLabel}</div>
                  ) : null}

                  <button
                    className={`btn w-100 mt-2 ${out ? "btn-outline-secondary" : "btn-primary"}`}
                    disabled={out}
                    onClick={() => add(p)}
                    aria-label={`Añadir ${p.nombre} al carrito`}
                  >
                    {out ? "Sin stock" : "Añadir"}
                  </button>

                  <Link
                    className="offer-card__link"
                    to={`/producto/${encodeURIComponent(p.id)}`}
                    aria-label={`Ver detalle de ${p.nombre}`}
                  >
                    Ver detalle
                  </Link>
                </div>
              </article>
            </div>
          );
        })}
      </section>
    </main>
  );
}
