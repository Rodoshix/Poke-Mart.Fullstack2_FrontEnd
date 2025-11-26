import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/assets/styles/checkout.css";

import * as cartStore from "@/lib/cartStore";
import { confirmMercadoPagoPayment } from "@/services/paymentApi.js";

const MONTH_FORMATTER = new Intl.DateTimeFormat("es-CL", { month: "long" });
const DAY_FORMATTER = new Intl.DateTimeFormat("es-CL", { day: "numeric" });
const FALLBACK_IMAGE = "/src/assets/img/tienda/productos/poke-Ball.png";

const readLastOrder = () => {
  try {
    const raw = sessionStorage.getItem("pm_lastOrder");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

const formatDeliveryRange = (payload) => {
  if (!payload) return null;
  const start = payload.start ? new Date(payload.start) : null;
  const end = payload.end ? new Date(payload.end) : null;
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }
  const month = MONTH_FORMATTER.format(end).replace(/^\w/, (c) => c.toUpperCase());
  return `Llega entre el ${DAY_FORMATTER.format(start)} y el ${DAY_FORMATTER.format(end)} de ${month}`;
};

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const order = useMemo(() => readLastOrder(), [location?.key]);
  const [confirmation, setConfirmation] = useState({
    loading: false,
    status: order?.status || null,
    orderId: order?.id || null,
    paymentId: null,
    error: null,
  });

  const deliveryWindow = formatDeliveryRange(order?.estimated);
  const orderIdLabel = confirmation.orderId || order?.id || order?.preferenceId || "en proceso";

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const paymentId = search.get("payment_id") || search.get("paymentId");
    const preferenceId = search.get("preference_id") || search.get("preferenceId") || order?.preferenceId;
    const externalReference = search.get("external_reference") || search.get("externalReference");
    if (!paymentId) return;

    let canceled = false;
    const confirm = async () => {
      setConfirmation((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const res = await confirmMercadoPagoPayment({
          paymentId: Number(paymentId),
          preferenceId,
          externalReference,
        });
        if (canceled) return;

        if (res?.status === "approved" && res?.orderId) {
          cartStore.clearCart();
          window.dispatchEvent(new Event("cart:updated"));
          const snapshot = {
            ...(order || {}),
            id: res.orderId,
            preferenceId: res.preferenceId || preferenceId || order?.preferenceId,
            paymentMethod: "Mercado Pago",
          };
          sessionStorage.setItem("pm_lastOrder", JSON.stringify(snapshot));
        }

        setConfirmation((prev) => ({
          ...prev,
          loading: false,
          status: res?.status || prev.status,
          orderId: res?.orderId || prev.orderId,
          paymentId: res?.paymentId || prev.paymentId,
          error: null,
        }));
      } catch (err) {
        if (canceled) return;
        setConfirmation((prev) => ({
          ...prev,
          loading: false,
          error: err?.message || "No pudimos confirmar tu pago. Intenta recargar.",
        }));
      }
    };
    confirm();
    return () => {
      canceled = true;
    };
  }, [location.search, order]);

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const hasPayment = search.get("payment_id") || search.get("paymentId");
    if (!order && !hasPayment) {
      const timeout = setTimeout(() => navigate("/catalogo", { replace: true }), 3500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [navigate, order, location.search]);

  if (!order) {
    return (
      <main className="site-main container my-5">
        <div className="checkout-result__header checkout-result__header--success">
          <div className="checkout-result__icon">✓</div>
          <div>
            <h1 className="checkout-result__title">¡Tu compra ha sido exitosa!</h1>
            <p className="checkout-result__subtitle">
              Te avisaremos cuando tus productos estén en camino.
            </p>
          </div>
        </div>
        <div className="checkout-result__empty">
          <p>No encontramos los detalles de tu compra reciente. Te llevaremos al catálogo en un instante.</p>
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => navigate("/catalogo", { replace: true })}
          >
            Volver al catálogo
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="site-main container my-5">
      <div className="checkout-result__header checkout-result__header--success">
        <div className="checkout-result__icon">✓</div>
        <div>
          <h1 className="checkout-result__title">¡Tu compra ha sido exitosa!</h1>
          <p className="checkout-result__subtitle">
            Te avisaremos cuando tus productos estén en camino.
          </p>
        </div>
      </div>

      {confirmation.loading && (
        <div className="alert alert-info my-3" role="status">
          Confirmando tu pago con Mercado Pago...
        </div>
      )}
      {confirmation.error && (
        <div className="alert alert-warning my-3" role="alert">
          {confirmation.error}
        </div>
      )}

      <section className="checkout-result__content">
        <article className="checkout-result__card">
          <header>
            <h2 className="checkout-result__card-title">
              {deliveryWindow ?? "Estamos preparando tu pedido"}
            </h2>
            <span className="checkout-result__card-subtitle">
              Pedido #{orderIdLabel} · {order?.paymentMethod || "Mercado Pago"}
            </span>
          </header>
          <ul className="checkout-result__items">
            {order.items?.map((item) => (
              <li key={item.id} className="checkout-result__item">
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.name}
                  className="checkout-result__item-image"
                />
                <div className="checkout-result__item-body">
                  <span className="checkout-result__item-name">{item.name}</span>
                  <span className="checkout-result__item-meta">
                    Vendedor: {item.vendor || "Poké Mart Oficial"}
                  </span>
                </div>
                <span className="checkout-result__item-qty">x{item.quantity}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <div className="checkout-result__actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/catalogo", { replace: true })}
        >
          Seguir comprando
        </button>
      </div>
    </main>
  );
};

export default CheckoutSuccessPage;
