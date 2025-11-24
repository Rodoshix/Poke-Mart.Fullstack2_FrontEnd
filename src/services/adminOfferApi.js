import { apiFetch } from "@/services/httpClient.js";

const mapOffer = (o = {}) => ({
  id: o.id,
  productId: o.productId,
  productName: o.productName ?? "",
  discountPct: Number(o.discountPct ?? 0),
  endsAt: o.endsAt ?? "",
  active: o.active !== false,
  expired: Boolean(o.expired),
});

export async function fetchAdminOffers() {
  const data = await apiFetch("/api/v1/admin/offers", { auth: true });
  if (!Array.isArray(data)) return [];
  return data.map(mapOffer);
}

export async function fetchAdminOffer(id) {
  const data = await apiFetch(`/api/v1/admin/offers/${id}`, { auth: true });
  return mapOffer(data);
}

export async function createAdminOffer(payload) {
  const body = {
    productId: Number(payload.productId),
    discountPct: Number(payload.discountPct),
    endsAt: payload.endsAt || null,
    active: payload.active ?? true,
  };
  const data = await apiFetch("/api/v1/admin/offers", { method: "POST", auth: true, body });
  return mapOffer(data);
}

export async function updateAdminOffer(id, payload) {
  const body = {
    productId: Number(payload.productId),
    discountPct: Number(payload.discountPct),
    endsAt: payload.endsAt || null,
    active: payload.active,
  };
  const data = await apiFetch(`/api/v1/admin/offers/${id}`, { method: "PUT", auth: true, body });
  return mapOffer(data);
}

export async function setAdminOfferActive(id, active) {
  const data = await apiFetch(`/api/v1/admin/offers/${id}/status?active=${active ? "true" : "false"}`, {
    method: "PUT",
    auth: true,
  });
  return mapOffer(data);
}

export async function deleteAdminOffer(id, hard = false) {
  await apiFetch(`/api/v1/admin/offers/${id}?hard=${hard ? "true" : "false"}`, { method: "DELETE", auth: true });
}
