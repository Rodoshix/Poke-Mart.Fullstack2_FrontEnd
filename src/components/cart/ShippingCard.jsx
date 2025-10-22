// usado en CartPage.jsx
// src/components/cart/ShippingCard.jsx
import { money } from "@/utils/money";

export default function ShippingCard({ subtotal, threshold, cost }) {
  const free = subtotal >= threshold;
  const percent = free ? 100 : Math.min(100, Math.round((subtotal / threshold) * 100));
  const missing = Math.max(0, threshold - subtotal);

  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold">Envío</span>
          <span className={`fw-semibold ${free ? "text-success" : ""}`}>
            {free ? "Gratis" : money(cost)}
          </span>
        </div>
        <div className="progress" style={{ height: 8 }}>
          <div className="progress-bar" role="progressbar" style={{ width: `${percent}%` }} />
        </div>
        <p className="small text-muted mt-2 mb-0">
          {free ? "Ya cuentas con envío gratis en esta compra."
                : `Agrega ${money(missing)} para obtener envío gratis.`}
        </p>
      </div>
    </div>
  );
}
