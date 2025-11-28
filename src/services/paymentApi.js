import { apiFetch } from "@/services/httpClient.js";

export async function createMercadoPagoPreference(payload, { auth = true } = {}) {
  return apiFetch("/api/v1/payments/mp/preference", {
    method: "POST",
    body: payload,
    auth,
  });
}

export async function confirmMercadoPagoPayment(payload) {
  return apiFetch("/api/v1/payments/mp/confirm", {
    method: "POST",
    body: payload,
    auth: false,
  });
}
