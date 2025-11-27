// usado en CartPage.jsx
// src/components/cart/CartItem.jsx
import { productFallback } from "@/assets/images.js";

const FALLBACK_IMAGE = productFallback;

export default function CartItem({ item, onInc, onDec, onChangeQty, onRemove }) {
  const max = Math.max(1, Number.isFinite(item.stock) ? item.stock : item.qty);
  const subtotalItem = item.qty * item.price;
  const showOffer = item._offer && (item._offer.discountPct > 0 || item.basePrice > item.price);
  const basePrice = showOffer ? (item._offer?.base ?? item.basePrice ?? item.price) : item.price;
  const offerPrice = showOffer ? (item._offer?.price ?? item.price) : item.price;
  const discount = item._offer?.discountPct;

  return (
    <article className="cart-item">
      <img
        className="cart-item__img"
        src={item.image}
        alt={item.name}
        onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
      />
      <div>
        <div className="cart-item__title">{item.name}</div>
        <div className="d-flex align-items-baseline gap-2">
          {showOffer && (
            <del className="text-muted small">
              {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(basePrice)}
            </del>
          )}
          <div className={`fw-semibold ${showOffer ? "text-danger" : "text-primary"}`}>
            {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item.price)}
          </div>
          {showOffer && item._offer?.discountPct != null && (
            <span className="badge text-bg-warning text-dark">-{item._offer.discountPct}%</span>
          )}
        </div>
        <div className="cart-item__meta">Stock disponible: {max}</div>
        {showOffer && (
          <div className="small text-success">
            Oferta aplicada:{" "}
            <del className="text-muted me-1">
              {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(basePrice)}
            </del>
            {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(offerPrice)}{" "}
            {typeof discount === "number" ? `(-${discount}%)` : ""}
          </div>
        )}
      </div>

      <div className="cart-item__price">
        <div className="qty mb-2">
          <button className="qty__btn" onClick={() => onDec(item.id)} aria-label="Disminuir">−</button>
          <input
            className="qty__value"
            type="number"
            min="1"
            max={max}
            value={item.qty}
            onChange={(e) => onChangeQty(item.id, e.target.value)}
          />
          <button className="qty__btn" onClick={() => onInc(item.id)} aria-label="Aumentar">+</button>
        </div>
        <div className="fw-semibold mb-1">
          {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(subtotalItem)}
        </div>
        <button className="cart-item__remove" onClick={() => onRemove(item.id)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}
