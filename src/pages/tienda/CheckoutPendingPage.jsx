import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/assets/styles/checkout.css";

const CheckoutPendingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rawMessage = location.state?.message;
  const messages = Array.isArray(rawMessage)
    ? rawMessage.filter((msg) => typeof msg === "string" && msg.trim().length > 0)
    : rawMessage && typeof rawMessage === "string"
      ? [rawMessage]
      : [];

  useEffect(() => {
    document.body.classList.add("page--checkout");
    return () => document.body.classList.remove("page--checkout");
  }, []);

  return (
    <main className="site-main container my-5">
      <div className="checkout-result__header checkout-result__header--pending">
        <div className="checkout-result__icon">⏳</div>
        <div>
          <h1 className="checkout-result__title">Tu pago est&aacute; en revisi&oacute;n</h1>
          <p className="checkout-result__subtitle">
            Mercado Pago a&uacute;n no confirma el resultado. Te avisaremos en cuanto se resuelva.
          </p>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="alert alert-info" role="status">
          <ul className="mb-0 ps-3">
            {messages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="checkout-result__content">
        <article className="checkout-result__card">
          <h2 className="checkout-result__card-title">Estamos esperando la confirmaci&oacute;n</h2>
          <p className="checkout-result__card-subtitle">
            Si el pago es aprobado, ver&aacute;s tu orden en la secci&oacute;n de &quot;Compra &eacute;xito&quot; y
            recibir&aacute;s un correo de confirmaci&oacute;n. Si MP lo rechaza, volver&aacute;s a la p&aacute;gina de error para reintentar.
          </p>
        </article>
      </section>

      <div className="checkout-result__actions gap-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/catalogo", { replace: true })}
        >
          Volver al cat&aacute;logo
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Volver al paso anterior
        </button>
      </div>
    </main>
  );
};

export default CheckoutPendingPage;
