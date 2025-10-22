// src/pages/tienda/CartPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@/assets/styles/carrito.css";
import { getAuth, getProfile } from "@/components/auth/session";

import CartList from "@/components/cart/CartList";
import ShippingCard from "@/components/cart/ShippingCard";
import CartSummary from "@/components/cart/CartSummary";
import { useCartViewModel } from "@/hooks/useCartViewModel";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totals, shippingConfig, actions } = useCartViewModel();

  // Guardia de sesión (igual que tu código)
  useEffect(() => {
    const s = getAuth();
    const p = getProfile();
    if (!s || !p) navigate("/", { replace: true });
  }, [navigate]);

  // Body class
  useEffect(() => {
    document.body.classList.add("page--carrito");
    return () => document.body.classList.remove("page--carrito");
  }, []);

  return (
    <main className="site-main container my-4">
      <h1 className="h3 mb-3">Carrito de compras</h1>

      <div className="row g-4">
        <section className="col-12 col-lg-8">
          <CartList
            items={items}
            actions={actions}
            onBrowseProducts={() => navigate("/catalogo")}
          />

          <ShippingCard
            subtotal={totals.subtotal}
            threshold={shippingConfig.SHIPPING_THRESHOLD}
            cost={shippingConfig.SHIPPING_COST}
          />
        </section>

        <aside className="col-12 col-lg-4">
          <CartSummary
            totalItems={totals.totalItems}
            subtotal={totals.subtotal}
            shipping={totals.shipping}
            total={totals.total}
            onCheckout={() => navigate("/compra")}
            onClear={actions.clear}
          />
        </aside>
      </div>
    </main>
  );
}
