import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/assets/styles/checkout.css";

const CheckoutErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rawMessage = location.state?.message;
  const messages = Array.isArray(rawMessage)
    ? rawMessage.filter((msg) => typeof msg === "string" && msg.trim().length > 0)
    : rawMessage && typeof rawMessage === "string"
    ? [rawMessage]
    : [];
  const fallbackMessage =
    "No pudimos procesar tu pago. Inténtalo nuevamente o contáctanos para recibir ayuda.";

  useEffect(() => {
    sessionStorage.removeItem("pm_lastOrder");
  }, []);

  return (
    <main className="site-main container my-5">
      <div className="checkout-result__header checkout-result__header--error">
        <div className="checkout-result__icon">!</div>
        <div>
          <h1 className="checkout-result__title">Ocurrió un problema con tu compra</h1>
          {messages.length > 0 ? (
            <ul className="checkout-result__subtitle mb-0 ps-3">
              {messages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          ) : (
            <p className="checkout-result__subtitle mb-0">{fallbackMessage}</p>
          )}
        </div>
      </div>

      <section className="checkout-result__content">
        <article className="checkout-result__card checkout-result__card--error">
          <h2 className="checkout-result__card-title">Aún no hemos generado tu orden</h2>
          <p className="checkout-result__card-subtitle">
            Vuelve al inicio para revisar tu carrito e intenta completar la compra nuevamente.
          </p>
        </article>
      </section>

      <div className="checkout-result__actions">
        <button type="button" className="btn btn-danger" onClick={() => navigate("/", { replace: true })}>
          Volver al inicio
        </button>
      </div>
    </main>
  );
};

export default CheckoutErrorPage;
