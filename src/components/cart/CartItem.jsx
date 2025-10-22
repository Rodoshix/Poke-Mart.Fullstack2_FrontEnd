// usado en CartPage.jsx
// src/components/cart/CartItem.jsx
const FALLBACK_IMAGE = "/src/assets/img/tienda/productos/poke-Ball.png";

export default function CartItem({ item, onInc, onDec, onChangeQty, onRemove }) {
  const max = Math.max(1, Number.isFinite(item.stock) ? item.stock : item.qty);
  const subtotalItem = item.qty * item.price;

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
        <div className="text-primary fw-semibold">
          {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item.price)}
        </div>
        <div className="cart-item__meta">Stock disponible: {max}</div>
        {item._offer && (
          <div className="small text-success">
            Oferta aplicada:{" "}
            <del className="text-muted me-1">
              {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item._offer.base)}
            </del>
            {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item._offer.price)} (
            -{item._offer.discountPct}%)
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
