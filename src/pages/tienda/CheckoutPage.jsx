// src/pages/tienda/CheckoutPage.jsx
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "@/assets/styles/checkout.css";

import * as cartStore from "@/lib/cartStore";
import { getAuth, getProfile } from "@/components/auth/session";
import { applyProductSale } from "@/services/productService.js";
import { createOrder as createOrderApi } from "@/services/orderApi.js";

import { useCartViewModel } from "@/hooks/useCartViewModel";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

import OrderSummaryTable from "@/components/checkout/OrderSummaryTable";
import CheckoutAddressForm from "@/components/checkout/CheckoutAddressForm";

import { money } from "@/utils/money";

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

  const pagarAhora = async () => {
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

      const adjustments = items.map(({ id, qty, product }) => ({
        id,
        productId: product?.id ?? id,
        quantity: qty,
      }));

      const PAYMENT_METHOD_LABELS = {
        credit: "Tarjeta de crédito",
        debit: "Tarjeta de débito",
        transfer: "Transferencia bancaria",
      };
      const selectedPaymentLabel =
        PAYMENT_METHOD_LABELS[form.paymentMethod] ?? PAYMENT_METHOD_LABELS.credit;

      const orderRecord = await createOrderApi(
        {
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.email || profile?.email || "",
          telefono: form.telefono || profile?.telefono || profile?.phone || "",
          region: form.region,
          comuna: form.comuna,
          calle: form.calle,
          departamento: form.departamento,
          notas: form.notas?.trim(),
          metodoPago: form.paymentMethod,
          items: items.map((item) => ({
            productoId: item.product?.id ?? Number(item.id),
            cantidad: Math.max(1, Number(item.qty) || 0),
          })),
        },
        { auth: true },
      );

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
