// usado en CartPage.jsx
// src/components/cart/CartList.jsx
import CartItem from "./CartItem";

export default function CartList({ items, actions, onBrowseProducts }) {
  if (!items.length) {
    return (
      <div id="cartList" className="cart-list card">
        <div className="p-4 text-center text-secondary">
          <p className="mb-1">Tu carrito está vacío.</p>
          <p className="small mb-3">Explora el catálogo y agrega tus artículos favoritos.</p>
          <button className="btn btn-primary" onClick={onBrowseProducts}>
            Ir a productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="cartList" className="cart-list card">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onInc={actions.inc}
          onDec={actions.dec}
          onChangeQty={actions.changeQty}
          onRemove={actions.remove}
        />
      ))}
    </div>
  );
}
