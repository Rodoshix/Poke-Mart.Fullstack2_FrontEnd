// src/pages/tienda/CheckoutPage.jsx
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "@/assets/styles/checkout.css";

import * as cartStore from "@/lib/cartStore";
import { getAuth, getProfile } from "@/components/auth/session";
import { applyProductSale } from "@/services/productService.js";

import { useCartViewModel } from "@/hooks/useCartViewModel";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

import OrderSummaryTable from "@/components/checkout/OrderSummaryTable";
import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";

import { money } from "@/utils/money";
import { createOrder } from "@/services/orderService.js";

export default function CheckoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const s = getAuth();
    const p = getProfile();
    if (!s || !p) navigate("/", { replace: true });
  }, [navigate]);

  const { items, totals } = useCartViewModel();
  const { subtotal, shipping, total } = totals;

  const { form, setField, validate } = useCheckoutForm();

  const estimatedWindow = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getTime() + 2 * 86_400_000);
    const end = new Date(now.getTime() + 5 * 86_400_000);
    return {
      start,
      end,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
    };
  }, []);

  const pagarAhora = () => {
    if (!items.length) return;

    const errs = validate();
    if (errs.length) {
      sessionStorage.removeItem("pm_lastOrder");
      navigate("/compra/error", {
        replace: true,
        state: { message: errs },
      });
      return;
    }

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

      const shippingMethod = "Despacho a domicilio";
      const shippingCarrier = "Pendiente";
      const PAYMENT_METHOD_LABELS = {
        credit: "Tarjeta de crédito",
        debit: "Tarjeta de débito",
        transfer: "Transferencia bancaria",
      };
      const selectedPaymentLabel =
        PAYMENT_METHOD_LABELS[form.paymentMethod] ?? PAYMENT_METHOD_LABELS.credit;

      const orderRecord = createOrder({
        customerId: profile?.id,
        customer:
          `${form.nombre} ${form.apellido}`.trim() ||
          profile?.nombre ||
          profile?.username ||
          "Cliente tienda",
        customerEmail: form.email || profile?.email || "",
        customerPhone: profile?.telefono || profile?.phone || "",
        status: "Pendiente de Envío",
        currency: "CLP",
        items: orderItems,
        summary: {
          subtotal: Math.round(subtotal),
          shipping: Math.round(shipping),
          discount: 0,
          total: Math.round(total),
        },
        payment: {
          method: selectedPaymentLabel,
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

      applyProductSale(adjustments);
      const orderSnapshot = {
        id: orderRecord.id,
        paymentMethod: selectedPaymentLabel,
        email: form.email,
        estimated: {
          start: estimatedWindow.startISO,
          end: estimatedWindow.endISO,
        },
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.qty,
          image: item.image,
          vendor: item.product?.vendor || "Poké Mart Oficial",
        })),
      };

      sessionStorage.setItem("pm_lastOrder", JSON.stringify(orderSnapshot));
      cartStore.clearCart();
      window.dispatchEvent(new Event("cart:updated"));
      navigate("/compra/exito", {
        replace: true,
        state: { orderId: orderSnapshot.id },
      });
    } catch (error) {
      console.error("No se pudo registrar la orden", error);
      sessionStorage.removeItem("pm_lastOrder");
      navigate("/compra/error", {
        replace: true,
        state: {
          message:
            "No pudimos completar tu pedido. Inténtalo nuevamente en unos minutos.",
        },
      });
    }
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
