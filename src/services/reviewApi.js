import { apiFetch } from "@/services/httpClient.js";

const mapReview = (r = {}) => ({
  id: r.id,
  rating: Number(r.rating ?? 0),
  comment: r.comment ?? "",
  author: r.author ?? "Usuario",
  createdAt: r.createdAt ?? null,
});

export async function fetchProductReviews(productId) {
  const data = await apiFetch(`/api/products/${productId}/reviews`);
  if (!Array.isArray(data)) return [];
  return data.map(mapReview);
}

export async function createProductReview(productId, payload) {
  const body = {
    rating: Number(payload.rating),
    comment: payload.comment,
  };
  const data = await apiFetch(`/api/products/${productId}/reviews`, { method: "POST", auth: true, body });
  return mapReview(data);
}

export async function deleteReviewAdmin(id) {
  await apiFetch(`/api/admin/reviews/${id}`, { method: "DELETE", auth: true });
}
