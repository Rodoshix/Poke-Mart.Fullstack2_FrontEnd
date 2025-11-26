// src/pages/tienda/CheckoutPage.jsx
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "@/assets/styles/checkout.css";

import * as cartStore from "@/lib/cartStore";
import { getAuth, getProfile } from "@/components/auth/session";
import { fetchProduct } from "@/services/catalogApi.js";
import { createMercadoPagoPreference } from "@/services/paymentApi.js";

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

  const ensureStockAvailable = useCallback(async () => {
    const issues = [];

    await Promise.all(
      items.map(async (item) => {
        const productId = item.product?.id ?? Number(item.id);
        if (!Number.isFinite(productId)) return;
        try {
          const latest = await fetchProduct(productId);
          const available = Math.max(0, Number(latest?.stock ?? 0));
          const desired = Math.max(1, Number(item.qty) || 0);
          if (!latest || available <= 0) {
            cartStore.removeItem(productId);
            issues.push(`"${item.name}" ya no tiene stock disponible y se elimin\u00f3 del carrito.`);
            return;
          }
          if (desired > available) {
            cartStore.setItemQty(productId, available, available);
            issues.push(`"${item.name}" ajustado a ${available} unidades por stock disponible.`);
          }
        } catch (err) {
          issues.push(
            `"${item.name}" no pudo verificarse en el cat\u00e1logo. Intenta nuevamente en unos segundos.`,
          );
        }
      }),
    );

    return issues;
  }, [items]);

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

      const stockIssues = await ensureStockAvailable();
      if (stockIssues.length) {
        sessionStorage.removeItem("pm_lastOrder");
        navigate("/compra/error", {
          replace: true,
          state: { message: stockIssues },
        });
        return;
      }

      const preference = await createMercadoPagoPreference(
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
          costoEnvio: shipping,
          items: items.map((item) => ({
            productoId: item.product?.id ?? Number(item.id),
            cantidad: Math.max(1, Number(item.qty) || 0),
          })),
        },
        { auth: false },
      );

      const preferenceId = preference?.preferenceId || preference?.id;

      const orderSnapshot = {
        id: preferenceId,
        preferenceId,
        paymentMethod: "Mercado Pago",
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

      const redirectUrl = preference?.initPoint || preference?.sandboxInitPoint || preference?.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      navigate("/compra/error", {
        replace: true,
        state: { message: ["No pudimos iniciar el pago con Mercado Pago."] },
      });
    } catch (error) {
      console.error("No se pudo iniciar el pago", error);
      sessionStorage.removeItem("pm_lastOrder");
      navigate("/compra/error", {
        replace: true,
        state: {
          message: error?.message || "No pudimos iniciar el pago. Inténtalo nuevamente en unos minutos.",
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
              Pagar con Mercado Pago
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
