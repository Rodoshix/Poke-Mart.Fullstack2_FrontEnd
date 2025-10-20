// src/pages/tienda/CartPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/assets/styles/carrito.css";

import { getAuth, getProfile } from "@/components/auth/session";
import * as cartStore from "@/lib/cartStore";
import products from "@/data/productos.json";

const SHIPPING_THRESHOLD = 1000;
const SHIPPING_COST = 4990;
const FALLBACK_IMAGE = "/src/assets/img/tienda/productos/poke-Ball.png";

const money = (v) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(v ?? 0);

const clamp = (value, min, max) => {
  const v = Number.isFinite(value) ? value : 0;
  return Math.max(min, Math.min(max, v));
};

function resolveImg(path) {
  const raw = (path ?? "").toString().trim();
  if (!raw) return FALLBACK_IMAGE;

  if (/^https?:\/\//i.test(raw)) return raw;

  let p = raw.replace(/^(?:\.\/|\.\.\/)+/, "").replace(/^\/+/, "");

  if (/^\/?src\/assets\//i.test(raw)) return raw.startsWith("/") ? raw : `/${raw}`;

  if (/^assets\//i.test(p)) return `/src/${p}`;

  if (/^(img|tienda)\//i.test(p)) return `/src/assets/img/${p}`;

  const i = p.toLowerCase().indexOf("assets/");
  if (i !== -1) return `/src/${p.slice(i)}`;

  return `/src/assets/${p}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const catalog = useMemo(() => new Map(products.map((p) => [String(p.id), p])), []);

  useEffect(() => {
    const s = getAuth();
    const p = getProfile();
    if (!s || !p) navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    document.body.classList.add("page--carrito");
    return () => document.body.classList.remove("page--carrito");
  }, []);

  const syncState = () => {
    const cart = cartStore.getCart();
    const enriched = cart.map((item) => {
      const id = String(item.id);
      const prod = catalog.get(id) || null;
      const price = Number(prod?.precio ?? item.price ?? 0);
      const stock = Number(prod?.stock ?? item.stock ?? item.qty ?? 0);
      const name = prod?.nombre ?? item.name ?? "Producto";
      const image = resolveImg(prod?.imagen ?? item.image ?? FALLBACK_IMAGE);
      const descripcion = prod?.descripcion ?? "";
      return { id, qty: Number(item.qty ?? 0), price, stock, name, image, descripcion, product: prod };
    });
    setItems(enriched);
  };

  useEffect(() => {
    syncState();
    const onCart = () => syncState();
    window.addEventListener("cart:updated", onCart);
    return () => window.removeEventListener("cart:updated", onCart);
  }, []);

  const totalItems = items.reduce((s, it) => s + it.qty, 0);
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const inc = (id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const max = Math.max(item.stock || 0, item.qty || 0);
    const next = clamp(item.qty + 1, 0, max);
    cartStore.setItemQty(id, next, item.stock);
    syncState();
  };
  const dec = (id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const max = Math.max(item.stock || 0, item.qty || 0);
    const next = clamp(item.qty - 1, 0, max);
    cartStore.setItemQty(id, next, item.stock);
    syncState();
  };
  const changeQty = (id, value) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const max = Math.max(item.stock || 0, item.qty || 0);
    const next = clamp(parseInt(value, 10), 0, max);
    cartStore.setItemQty(id, next, item.stock);
    syncState();
  };
  const remove = (id) => {
    cartStore.removeItem(id);
    syncState();
  };
  const clear = () => {
    if (!items.length) return;
    cartStore.clearCart();
    syncState();
  };

  return (
    <main className="site-main container my-4">
      <h1 className="h3 mb-3">Carrito de compras</h1>

      <div className="row g-4">
        <section className="col-12 col-lg-8">
          <div id="cartList" className="cart-list card">
            {!items.length ? (
              <div className="p-4 text-center text-secondary">
                <p className="mb-1">Tu carrito está vacío.</p>
                <p className="small mb-3">Explora el catálogo y agrega tus artículos favoritos.</p>
                <button className="btn btn-primary" onClick={() => navigate("/catalogo")}>
                  Ir a productos
                </button>
              </div>
            ) : (
              items.map((item) => {
                const max = Math.max(1, Number.isFinite(item.stock) ? item.stock : item.qty);
                const subtotalItem = item.qty * item.price;
                return (
                  <article className="cart-item" key={item.id}>
                    <img
                      className="cart-item__img"
                      src={item.image}
                      alt={item.name}
                      onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                    />
                    <div>
                      <div className="cart-item__title">{item.name}</div>
                      <div className="text-primary fw-semibold">{money(item.price)}</div>
                      <div className="cart-item__meta">Stock disponible: {max}</div>
                    </div>

                    <div className="cart-item__price">
                      <div className="qty mb-2">
                        <button className="qty__btn" onClick={() => dec(item.id)} aria-label="Disminuir">
                          −
                        </button>
                        <input
                          className="qty__value"
                          type="number"
                          min="1"
                          max={max}
                          value={item.qty}
                          onChange={(e) => changeQty(item.id, e.target.value)}
                        />
                        <button className="qty__btn" onClick={() => inc(item.id)} aria-label="Aumentar">
                          +
                        </button>
                      </div>
                      <div className="fw-semibold mb-1">{money(subtotalItem)}</div>
                      <button className="cart-item__remove" onClick={() => remove(item.id)}>
                        Eliminar
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Envío</span>
                <span className={`fw-semibold ${subtotal >= SHIPPING_THRESHOLD ? "text-success" : ""}`}>
                  {subtotal >= SHIPPING_THRESHOLD ? "Gratis" : money(SHIPPING_COST)}
                </span>
              </div>
              <div className="progress" style={{ height: 8 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${
                      subtotal >= SHIPPING_THRESHOLD ? 100 : Math.min(100, Math.round((subtotal / SHIPPING_THRESHOLD) * 100))
                    }%`,
                  }}
                />
              </div>
              <p className="small text-muted mt-2 mb-0">
                {subtotal >= SHIPPING_THRESHOLD
                  ? "Ya cuentas con envío gratis en esta compra."
                  : `Agrega ${money(SHIPPING_THRESHOLD - subtotal)} para obtener envío gratis.`}
              </p>
            </div>
          </div>
        </section>

        <aside className="col-12 col-lg-4">
          <div className="cart-summary card">
            <div className="card-body">
              <h2 className="h6 mb-3">Resumen de compra</h2>
              <div className="d-flex justify-content-between">
                <span>
                  Productos (<span id="summaryItems">{totalItems}</span>)
                </span>
                <span id="summarySubtotal">{money(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Envío</span>
                <span id="summaryShipping" className={shipping ? "" : "text-success"}>
                  {shipping ? money(shipping) : "Gratis"}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span id="summaryTotal">{money(total)}</span>
              </div>
              <button
                id="goCheckout"
                className="btn btn-primary w-100 mt-3"
                disabled={!totalItems}
                onClick={() => alert("Proceso de compra disponible en la siguiente fase del proyecto.")}
              >
                Confirmar compra
              </button>
              <div className="mt-3">
                <button
                  id="clearCart"
                  className="btn btn-outline-secondary w-100 btn-sm"
                  disabled={!totalItems}
                  onClick={clear}
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
