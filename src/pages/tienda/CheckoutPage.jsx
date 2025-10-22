// src/pages/tienda/CheckoutPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "@/assets/styles/checkout.css";

import * as cartStore from "@/lib/cartStore";
import productos from "@/data/productos.json";
import usersData from "@/data/users.json";

import { getAuth, getProfile } from "@/components/auth/session";

const FALLBACK_IMAGE = "/src/assets/img/tienda/productos/poke-Ball.png";
const SHIPPING_THRESHOLD = 1000;
const SHIPPING_COST = 4990;

const REGIONES = [
  { region: "Kanto", comunas: ["Ciudad Central", "Ciudad Azafran", "Ciudad Celeste", "Pueblo Paleta"] },
  { region: "Johto", comunas: ["Ciudad Trigal", "Ciudad Iris", "Pueblo Primavera", "Ciudad Olivo"] },
  { region: "Hoenn", comunas: ["Ciudad Portual", "Ciudad Arborada", "Ciudad Calagua", "Pueblo Azuliza"] },
  { region: "Sinnoh", comunas: ["Ciudad Jubileo", "Ciudad Corazon", "Ciudad Pradera", "Pueblo Hojaverde"] },
];

const money = (v) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v ?? 0);

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

const first = (...vals) => vals.find((v) => v !== undefined && v !== null && String(v).trim() !== "") ?? "";
function extractUsers(data) {
  if (!data) return [];
  if (Array.isArray(data.users)) return data.users;
  if (Array.isArray(data) && data.length && Array.isArray(data[0]?.users)) return data[0].users;
  return [];
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  // ===== Guard de sesión =====
  useEffect(() => {
    const s = getAuth();
    const p = getProfile();
    if (!s || !p) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // ===== Carrito =====
  const catalog = useMemo(() => new Map(productos.map((p) => [String(p.id), p])), []);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const cart = cartStore.getCart();
    const mapped = cart.map((it) => {
      const prod = catalog.get(String(it.id)) || {};
      const image = resolveImg(prod.imagen ?? it.image ?? FALLBACK_IMAGE);
      const name = prod.nombre ?? it.nombre ?? it.name ?? "Producto";
      const price = Number(it.price ?? it.precio ?? prod.precio ?? 0);
      const qty = Number(it.qty ?? 1);
      return { id: String(it.id), name, image, price, qty };
    });
    setItems(mapped);
  }, [catalog]);

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  // ===== Form =====
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    calle: "",
    departamento: "",
    region: "",
    comuna: "",
    notas: "",
  });

  // Autocompletar desde sesión + users.json
  useEffect(() => {
    const auth = getAuth();
    const profile = getProfile();
    if (!auth || !profile) return;

    let base = profile;
    try {
      const list = extractUsers(usersData);
      const keyUser = String(profile.username || "").toLowerCase();
      const keyMail = String(profile.email || profile.correo || "").toLowerCase();

      let extra =
        list.find(
          (u) =>
            (u.username && String(u.username).toLowerCase() === keyUser && keyUser) ||
            (u.email && String(u.email).toLowerCase() === keyMail && keyMail)
        ) || null;

      if (!extra && profile.nombre && profile.apellido) {
        extra = list.find(
          (u) =>
            String(u.nombre || "").toLowerCase() === String(profile.nombre).toLowerCase() &&
            String(u.apellido || "").toLowerCase() === String(profile.apellido).toLowerCase()
        ) || null;
      }

      if (extra) base = { ...extra, ...base };
    } catch {}

    const envio =
      base.envio ||
      base.shipping ||
      base.direccionEnvio ||
      base.direcciónEnvio ||
      base.delivery ||
      (base.address && (base.address.shipping || base.address.envio)) ||
      base.address ||
      {};

    const nombre = first(base.nombre, base.nombres, base.firstName, base.name);
    const apellido = first(base.apellido, base.apellidos, base.lastName, base.surname);
    const email = first(base.email, base.correo, base.mail);

    const calle = first(
      base.calle,
      base.direccion,
      base.dirección,
      envio.calle,
      envio.direccion,
      envio.dirección,
      envio.line1,
      envio.dir1
    );
    const departamento = first(
      base.departamento,
      base.depto,
      envio.departamento,
      envio.depto,
      envio.line2,
      envio.apto,
      envio.apartment
    );
    const region = first(
      base.region,
      envio.region,
      base.regionOrigen,
      base.region_origen,
      envio.state,
      envio.provincia
    );
    const comuna = first(
      base.comuna,
      envio.comuna,
      base.ciudad,
      envio.ciudad,
      envio.localidad,
      envio.town,
      envio.city
    );

    setForm((prev) => ({
      ...prev,
      nombre: prev.nombre || nombre,
      apellido: prev.apellido || apellido,
      email: prev.email || email,
      calle: prev.calle || calle,
      departamento: prev.departamento || departamento,
      region: prev.region || region,
      comuna: prev.comuna || comuna,
    }));
  }, []);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ===== Pago + Modal =====
  const [status, setStatus] = useState(null); // 'ok' | 'error' | null
  const [orderId, setOrderId] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  function validateForm() {
    const errs = [];
    if (!form.nombre.trim()) errs.push("El nombre es requerido.");
    if (!form.apellido.trim()) errs.push("El apellido es requerido.");
    if (!form.email.trim() || !form.email.includes("@")) errs.push("El correo es inválido.");
    if (!form.calle.trim()) errs.push("La calle/dirección es requerida.");

    const regionEntry = REGIONES.find((r) => r.region === form.region);
    if (!form.region.trim()) {
      errs.push("Debes ingresar una región.");
    } else if (!regionEntry) {
      errs.push("La región ingresada no existe.");
    }

    if (!form.comuna.trim()) {
      errs.push("Debes ingresar una comuna.");
    } else if (regionEntry && !regionEntry.comunas.includes(form.comuna)) {
      errs.push("La comuna no pertenece a la región ingresada.");
    }

    return errs;
  }

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const pagarAhora = () => {
    if (!items.length) return;

    const errs = validateForm();
    if (errs.length) {
      setErrorMsgs(errs);
      setStatus("error");
      openModal();
      return;
    }

    const oid = `PM-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(oid);
    setStatus("ok");
    setErrorMsgs([]);
    cartStore.clearCart();
    window.dispatchEvent(new Event("cart:updated"));
    openModal();
  };

  useEffect(() => {
    document.body.classList.add("page--checkout");
    return () => document.body.classList.remove("page--checkout");
  }, []);

  return (
    <main className="site-main container my-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="h4 m-0">Completar compra</h1>
        <div className="fw-semibold">
          Total a pagar: <span className="badge text-bg-primary fs-6">{money(total)}</span>
        </div>
      </div>

      {/* MODAL de pago */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0,0,0,.6)", zIndex: 1050 }}
            onClick={closeModal}
          />
          {/* Caja */}
          <div
            role="dialog"
            aria-modal="true"
            className="position-fixed start-50 top-50 translate-middle"
            style={{ zIndex: 1060, width: "min(560px, 92vw)" }}
          >
            <div
              className="shadow-lg rounded-4 overflow-hidden"
              style={{
                background: "#121417",
                color: "#e8eef7",
                border: `1px solid ${status === "ok" ? "#19c37d55" : "#ef444455"}`,
              }}
            >
              <div
                className="px-4 py-3 d-flex align-items-center justify-content-between"
                style={{
                  background:
                    status === "ok"
                      ? "linear-gradient(90deg,#0f5132,#198754)"
                      : "linear-gradient(90deg,#7f1d1d,#dc2626)",
                }}
              >
                <h2 className="h6 m-0">
                  {status === "ok" ? "Pago exitoso" : "Pago fallido"}
                </h2>
                <button
                  className="btn btn-sm btn-light opacity-75"
                  onClick={closeModal}
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <div className="p-4">
                {status === "ok" ? (
                  <>
                    <p className="mb-1">
                      Pedido <span className="fw-semibold">{orderId}</span> confirmado.
                    </p>
                    <p className="text-secondary mb-3">
                      Te enviaremos la confirmación a <span className="fw-semibold">{form.email}</span>.
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-success" onClick={() => navigate("/")}>
                        Volver al inicio
                      </button>
                      <button
                        className="btn btn-outline-light"
                        onClick={() => {
                          closeModal();
                          navigate("/catalogo");
                        }}
                      >
                        Seguir comprando
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-2">Corrige los siguientes problemas antes de reintentar:</p>
                    <ul className="mb-3">
                      {errorMsgs.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          closeModal();
                          // lleva al usuario al formulario
                          setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 0);
                        }}
                      >
                        Corregir datos
                      </button>
                      <button className="btn btn-outline-light" onClick={closeModal}>
                        Cerrar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="row g-4 mt-2">
        {/* Resumen */}
        <section className="col-12">
          <div className="card">
            <div className="card-body">
              <p className="fw-semibold mb-2">Resumen del pedido</p>
              {!items.length ? (
                <div className="text-secondary">Tu carrito está vacío.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 90 }}>Imagen</th>
                        <th>Nombre</th>
                        <th style={{ width: 120 }}>Precio</th>
                        <th style={{ width: 110 }}>Cantidad</th>
                        <th style={{ width: 130 }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it) => (
                        <tr key={it.id}>
                          <td>
                            <img
                              src={it.image}
                              alt={it.name}
                              width={64}
                              height={48}
                              style={{ objectFit: "contain", borderRadius: 6, background: "#f6f8fb" }}
                              onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                            />
                          </td>
                          <td>{it.name}</td>
                          <td>{money(it.price)}</td>
                          <td>{it.qty}</td>
                          <td className="fw-semibold">{money(it.price * it.qty)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="text-end">Subtotal</td>
                        <td className="fw-semibold">{money(subtotal)}</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="text-end">Envío</td>
                        <td className="fw-semibold">{shipping ? money(shipping) : "Gratis"}</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="text-end">Total</td>
                        <td className="fw-bold fs-5">{money(total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Formulario de envío */}
        <section className="col-12">
          <div className="card">
            <div className="card-body">
              <h2 className="h6">Información del cliente</h2>
              <p className="text-secondary small">Se autocompleta si iniciaste sesión. Puedes editarla.</p>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre*</label>
                  <input
                    className="form-control"
                    value={form.nombre}
                    onChange={(e) => setField("nombre", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Apellidos*</label>
                  <input
                    className="form-control"
                    value={form.apellido}
                    onChange={(e) => setField("apellido", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Correo*</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                </div>
              </div>

              <h2 className="h6 mt-4">Dirección de entrega</h2>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Calle*</label>
                  <input
                    className="form-control"
                    placeholder="Ej: Calle Principal 123"
                    value={form.calle}
                    onChange={(e) => setField("calle", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Departamento (opcional)</label>
                  <input
                    className="form-control"
                    placeholder="Ej: 603"
                    value={form.departamento}
                    onChange={(e) => setField("departamento", e.target.value)}
                  />
                </div>

                {/* Inputs libres */}
                <div className="col-md-6">
                  <label className="form-label">Región*</label>
                  <input
                    className="form-control"
                    placeholder="Ej: Kanto"
                    value={form.region}
                    onChange={(e) => setField("region", e.target.value)}
                  />
                  <div className="form-text">Debe ser una de: {REGIONES.map((r) => r.region).join(", ")}.</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Comuna*</label>
                  <input
                    className="form-control"
                    placeholder="Ej: Ciudad Celeste"
                    value={form.comuna}
                    onChange={(e) => setField("comuna", e.target.value)}
                  />
                  {!!form.region &&
                    REGIONES.find((r) => r.region === form.region)?.comunas?.length > 0 && (
                      <div className="form-text">
                        Comunas válidas para {form.region}:{" "}
                        {REGIONES.find((r) => r.region === form.region).comunas.join(", ")}.
                      </div>
                    )}
                </div>

                <div className="col-12">
                  <label className="form-label">Indicaciones (opcional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Ej: Entre calles, color del edificio, no tiene timbre…"
                    value={form.notas}
                    onChange={(e) => setField("notas", e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button className="btn btn-success" disabled={!items.length} onClick={pagarAhora}>
                  Pagar ahora {money(total)}
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigate("/carrito")}>
                  Volver al carrito
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
