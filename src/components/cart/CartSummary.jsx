// usado en CartPage.jsx
// src/components/cart/CartSummary.jsx
import { money } from "@/utils/money";

export default function CartSummary({
  totalItems,
  subtotal,
  shipping,
  total,
  onCheckout,
  onClear,
  canClear = true,
}) {
  return (
    <div className="cart-summary card">
      <div className="card-body">
        <h2 className="h6 mb-3">Resumen de compra</h2>

        <div className="d-flex justify-content-between">
          <span>Productos (<span id="summaryItems">{totalItems}</span>)</span>
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
          onClick={onCheckout}
        >
          Confirmar compra
        </button>

        <div className="mt-3">
          <button
            id="clearCart"
            className="btn btn-outline-secondary w-100 btn-sm"
            disabled={!totalItems || !canClear}
            onClick={onClear}
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}
