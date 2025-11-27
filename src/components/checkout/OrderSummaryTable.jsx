// usado por CheckoutPage.jsx
// src/components/checkout/OrderSummaryTable.jsx
import { money } from "@/utils/money";
import { productFallback } from "@/assets/images.js";

const FALLBACK_IMAGE = productFallback;

export default function OrderSummaryTable({ items = [], subtotal = 0, shipping = 0, total = 0 }) {
  return (
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
  );
}
