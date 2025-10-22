// src/components/checkout/PaymentModal.jsx
export default function PaymentModal({
  open, status, orderId, email, errors = [],
  onClose, onGoHome, onKeepShopping, onFixData,
}) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ background: "rgba(0,0,0,.6)", zIndex: 1050 }}
        onClick={onClose}
      />
      {/* Caja */}
      <div role="dialog" aria-modal="true" className="position-fixed start-50 top-50 translate-middle" style={{ zIndex: 1060, width: "min(560px, 92vw)" }}>
        <div className="shadow-lg rounded-4 overflow-hidden"
             style={{ background: "#121417", color: "#e8eef7", border: `1px solid ${status === "ok" ? "#19c37d55" : "#ef444455"}` }}>
          <div className="px-4 py-3 d-flex align-items-center justify-content-between"
               style={{ background: status === "ok" ? "linear-gradient(90deg,#0f5132,#198754)" : "linear-gradient(90deg,#7f1d1d,#dc2626)" }}>
            <h2 className="h6 m-0">{status === "ok" ? "Pago exitoso" : "Pago fallido"}</h2>
            <button className="btn btn-sm btn-light opacity-75" onClick={onClose} aria-label="Cerrar">✕</button>
          </div>

          <div className="p-4">
            {status === "ok" ? (
              <>
                <p className="mb-1">Pedido <span className="fw-semibold">{orderId}</span> confirmado.</p>
                <p className="text-secondary mb-3">Te enviaremos la confirmación a <span className="fw-semibold">{email}</span>.</p>
                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-success" onClick={onGoHome}>Volver al inicio</button>
                  <button className="btn btn-outline-light" onClick={onKeepShopping}>Seguir comprando</button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-2">Corrige los siguientes problemas antes de reintentar:</p>
                <ul className="mb-3">
                  {errors.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-danger" onClick={onFixData}>Corregir datos</button>
                  <button className="btn btn-outline-light" onClick={onClose}>Cerrar</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
