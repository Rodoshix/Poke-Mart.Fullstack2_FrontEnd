import { apiFetch } from "@/services/httpClient.js";

const mapReview = (r = {}) => ({
  id: r.id,
  productId: r.productId,
  productName: r.productName ?? "",
  category: r.category ?? "",
  rating: Number(r.rating ?? 0),
  comment: r.comment ?? "",
  author: r.author ?? "",
  createdAt: r.createdAt ?? "",
});

export async function fetchAdminReviews() {
  const data = await apiFetch("/api/v1/admin/reviews", { auth: true });
  if (!Array.isArray(data)) return [];
  return data.map(mapReview);
}

export async function deleteAdminReview(id) {
  await apiFetch(`/api/v1/admin/reviews/${id}`, { method: "DELETE", auth: true });
}
