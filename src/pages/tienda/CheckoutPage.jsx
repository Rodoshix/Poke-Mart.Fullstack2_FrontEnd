// src/pages/tienda/CheckoutPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/assets/styles/checkout.css";

import * as cartStore from "@/lib/cartStore";
import { getAuth, getProfile } from "@/components/auth/session";
import { applyProductSale } from "@/services/productService.js";

import { useCartViewModel } from "@/hooks/useCartViewModel";      // ya creado en el carrito
import { useCheckoutForm } from "@/hooks/useCheckoutForm";        // nuevo

import OrderSummaryTable from "@/components/checkout/OrderSummaryTable";
import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";
import PaymentModal from "@/components/checkout/PaymentModal";

import { money } from "@/utils/money";
import { createOrder } from "@/services/orderService.js";

export default function CheckoutPage() {
  const navigate = useNavigate();

  // Guardia de sesión
  useEffect(() => {
    const s = getAuth();
    const p = getProfile();
    if (!s || !p) navigate("/", { replace: true });
  }, [navigate]);

  // Carrito (reuso del hook del carrito)
  const { items, totals } = useCartViewModel();
  const { subtotal, shipping, total } = totals;

  // Formulario y validación
  const { form, setField, validate } = useCheckoutForm();

  // Modal/pago
  const [status, setStatus] = useState(null); // 'ok' | 'error' | null
  const [orderId, setOrderId] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const pagarAhora = () => {
    if (!items.length) return;

    const errs = validate();
    if (errs.length) {
      setErrorMsgs(errs);
      setStatus("error");
      openModal();
      return;
    }

    let orderRecord = null;
    try {
      const profile = getProfile();
      const now = new Date();

      const adjustments = items.map(({ id, qty, product }) => ({
        id,
        productId: product?.id ?? id,
        quantity: qty,
      }));

      const orderItems = items.map((item) => ({
        productId: item.product?.id ?? Number(item.id),
        sku: String(item.product?.id ?? item.id),
        name: item.name,
        quantity: Math.max(1, Number(item.qty) || 0),
        unitPrice: Math.max(0, Number(item.price) || 0),
      }));

      const shippingMethod = shipping > 0 ? "Despacho estándar" : "Retiro en tienda";
      const shippingCarrier = shipping > 0 ? "Poké Express" : "Retiro en tienda";

      applyProductSale(adjustments);

      orderRecord = createOrder({
        customerId: profile?.id,
        customer:
          `${form.nombre} ${form.apellido}`.trim() ||
          profile?.nombre ||
          profile?.username ||
          "Cliente tienda",
        customerEmail: form.email || profile?.email || "",
        customerPhone: profile?.telefono || profile?.phone || "",
        status: "completed",
        currency: "CLP",
        items: orderItems,
        summary: {
          subtotal: Math.round(subtotal),
          shipping: Math.round(shipping),
          discount: 0,
          total: Math.round(total),
        },
        payment: {
          method: "Pago en línea",
          status: "Pagado",
          transactionId: `PAY-${Date.now()}`,
          capturedAt: now.toISOString(),
        },
        shipping: {
          method: shippingMethod,
          carrier: shippingCarrier,
          cost: Math.round(shipping),
          address: {
            street: form.calle,
            city: form.comuna,
            region: form.region,
            reference: form.departamento,
            country: "Chile",
          },
        },
        notes: form.notas?.trim(),
      });
    } catch (error) {
      console.error("No se pudo registrar la orden", error);
      setStatus("error");
      setErrorMsgs(["Ocurrió un problema al registrar la orden. Intenta nuevamente."]);
      openModal();
      return;
    }

    const fallbackId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(orderRecord?.id ?? fallbackId);
    setStatus("ok");
    setErrorMsgs([]);
    cartStore.clearCart();
    window.dispatchEvent(new Event("cart:updated"));
    openModal();
  };

  useEffect(() => {
    document.body.classList.add("page--checkout");
    return () => document.body.classList.remove("page--checkout");
  }, []);

  return (
    <main className="site-main container my-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="h4 m-0">Completar compra</h1>
        <div className="fw-semibold">
          Total a pagar: <span className="badge text-bg-primary fs-6">{money(total)}</span>
        </div>
      </div>

      {/* Modal de pago */}
      <PaymentModal
        open={showModal}
        status={status}
        orderId={orderId}
        email={form.email}
        errors={errorMsgs}
        onClose={closeModal}
        onGoHome={() => navigate("/")}
        onKeepShopping={() => { closeModal(); navigate("/catalogo"); }}
        onFixData={() => {
          closeModal();
          setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 0);
        }}
      />

      <div className="row g-4 mt-2">
        <section className="col-12">
          <OrderSummaryTable items={items} subtotal={subtotal} shipping={shipping} total={total} />
        </section>

        <section className="col-12">
          <CheckoutAddressForm form={form} setField={setField} />
          <div className="d-flex flex-wrap gap-2 mt-4">
            <button className="btn btn-success" disabled={!items.length} onClick={pagarAhora}>
              Pagar ahora {money(total)}
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate("/carrito")}>
              Volver al carrito
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
