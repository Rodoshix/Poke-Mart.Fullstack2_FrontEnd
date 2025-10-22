// src/pages/tienda/OffersPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import products from "@/data/productos.json";
import offers from "@/data/ofertas.json";
import * as cartStore from "@/lib/cartStore";
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
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v ?? 0);

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function computeOffer(product, overlayById) {
  const o = overlayById.get(String(product.id));
  if (!o || !(Number(o.discountPct) > 0)) {
    return { onSale: false, basePrice: Number(product.precio) || 0, price: Number(product.precio) || 0, discountPct: 0, endsAt: null, expiresInMs: null };
  }
  const now = Date.now();
  const startsAt = o.startsAt ? Date.parse(String(o.startsAt).trim()) : NaN;
  const endsAt = o.endsAt ? Date.parse(String(o.endsAt).trim()) : NaN;

  const started = Number.isNaN(startsAt) ? true : now >= startsAt;
  const notEnded = Number.isNaN(endsAt) ? true : now <= endsAt;

  const active = started && notEnded;
  const base = Number(product.precio) || 0;
  const pct = clamp(Number(o.discountPct) || 0, 0, 95);
  const price = active ? Math.round(base * (1 - pct / 100)) : base;

  return {
    onSale: active,
    basePrice: base,
    price,
    discountPct: pct,
    endsAt: Number.isNaN(endsAt) ? null : endsAt,
    expiresInMs: Number.isNaN(endsAt) ? null : endsAt - now,
  };
}

const badge = (pct) => (pct >= 5 ? <span className="offer-badge">-{pct}%</span> : null);

const countdown = (ms) => {
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

  // índice de overlays por id
  const overlayById = useMemo(() => {
    const list = Array.isArray(offers) ? offers : [];
    return new Map(list.map((o) => [String(o.id), o]));
  }, []);

  // productos con oferta activa
  const items = useMemo(() => {
    const raw = Array.isArray(products) ? products : [];
    return raw
      .map((p) => {
        const offer = computeOffer(p, overlayById);
        return {
          ...p,
          img: resolveImg(p.imagen),
          stock: Number(p.stock ?? 0),
          offer,
        };
      })
      .filter((x) => x.offer.onSale);
  }, [overlayById]);

  const [sort, setSort] = useState("best"); // best | priceAsc | priceDesc | ending
  const sorted = useMemo(() => {
    const list = items.slice();
    switch (sort) {
      case "priceAsc":
        list.sort((a, b) => a.offer.price - b.offer.price);
        break;
      case "priceDesc":
        list.sort((a, b) => b.offer.price - a.offer.price);
        break;
      case "ending":
        list.sort(
          (a, b) =>
            (a.offer.expiresInMs == null ? Number.POSITIVE_INFINITY : a.offer.expiresInMs) -
            (b.offer.expiresInMs == null ? Number.POSITIVE_INFINITY : b.offer.expiresInMs)
        );
        break;
      case "best":
      default:
        list.sort((a, b) => b.offer.discountPct - a.offer.discountPct);
    }
    return list;
  }, [items, sort]);

  const add = (p) => {
    const available = cartStore.getAvailableStock(String(p.id), Number(p.stock ?? 0));
    if (available <= 0) return;
    // Enviamos precio rebajado; la imagen la resolverá el catálogo en CartPage
    const offerPrice = Number.isFinite(p.offer.price) ? p.offer.price : Number(p.precio ?? 0);
    cartStore.addItem(
      {
        id: p.id,
        nombre: p.nombre,
        precio: offerPrice,
        price: offerPrice,
        _offer: {
          base: Number(p.precio ?? 0),
          price: offerPrice,
          discountPct: p.offer.discountPct,
          endsAt: p.offer.endsAt,
        },
      },
      1
    );
    window.dispatchEvent(new Event("cart:updated"));
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
          <label className="form-label m-0 me-1" htmlFor="sort">
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

                  {p.offer.expiresInMs != null ? (
                    <div className="offer-card__ends text-secondary small">Termina en {countdown(p.offer.expiresInMs)}</div>
                  ) : null}

                  <button
                    className={`btn w-100 mt-2 ${out ? "btn-outline-secondary" : "btn-primary"}`}
                    disabled={out}
                    onClick={() => add(p)}
                    aria-label={`Añadir ${p.nombre} al carrito`}
                  >
                    {out ? "Sin stock" : "Añadir"}
                  </button>

                  <Link className="offer-card__link" to={`/producto/${p.id}`}>
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
