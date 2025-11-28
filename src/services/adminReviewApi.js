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

export async function fetchAdminReviews({ page = 0, size = 20, categoria = "", productoId = "" } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (categoria) params.set("categoria", categoria);
  if (productoId) params.set("productoId", productoId);
  const data = await apiFetch(`/api/v1/admin/reviews?${params.toString()}`, { auth: true });
  if (Array.isArray(data)) {
    return { items: data.map(mapReview), total: data.length, totalPages: 1, page: 0, size: data.length || 0 };
  }
  if (data && Array.isArray(data.content)) {
    return {
      items: data.content.map(mapReview),
      total: Number(data.totalElements ?? data.total ?? data.content.length),
      totalPages: Number(data.totalPages ?? 1),
      page: Number(data.number ?? data.page ?? 0),
      size: Number(data.size ?? data.content.length ?? 0),
    };
  }
  return { items: [], total: 0, totalPages: 0, page: 0, size: 0 };
}

export async function deleteAdminReview(id) {
  await apiFetch(`/api/v1/admin/reviews/${id}`, { method: "DELETE", auth: true });
}

export async function fetchAdminReviewCategories() {
  const data = await apiFetch("/api/v1/admin/reviews/categories", { auth: true });
  return Array.isArray(data) ? data : [];
}
