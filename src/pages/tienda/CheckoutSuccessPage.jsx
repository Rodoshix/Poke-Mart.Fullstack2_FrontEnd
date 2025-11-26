import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/assets/styles/checkout.css";

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
  const deliveryWindow = formatDeliveryRange(order?.estimated);
  const orderIdLabel = order?.id || order?.preferenceId || "en proceso";

  useEffect(() => {
    if (!order) {
      const timeout = setTimeout(() => navigate("/catalogo", { replace: true }), 3500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [navigate, order]);

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
