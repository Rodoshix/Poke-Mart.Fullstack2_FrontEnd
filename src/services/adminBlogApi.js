import { apiFetch } from "@/services/httpClient.js";

const mapBlog = (b = {}) => ({
  id: b.id,
  slug: b.slug || b.id,
  titulo: b.titulo || "",
  descripcion: b.descripcion || "",
  contenido: b.contenido || "",
  categoria: b.categoria || "",
  etiquetas: Array.isArray(b.etiquetas) ? b.etiquetas : [],
  imagen: b.imagen || "",
  estado: b.estado || "",
  autor: b.autor || "",
  fechaPublicacion: b.fechaPublicacion || b.fecha || b.publicadoEn || null,
  creadoEn: b.creadoEn || b.creadoEl || null,
  actualizadoEn: b.actualizadoEn || b.actualizadoEl || null,
});

export async function fetchAdminBlogs({ categoria, estado, q } = {}) {
  const params = new URLSearchParams();
  if (categoria) params.set("categoria", categoria);
  if (estado) params.set("estado", estado);
  if (q) params.set("q", q);
  const data = await apiFetch(`/api/v1/admin/blogs${params.toString() ? `?${params.toString()}` : ""}`, { auth: true });
  if (!Array.isArray(data)) return [];
  return data.map(mapBlog);
}

export async function createAdminBlog(payload) {
  const data = await apiFetch("/api/v1/admin/blogs", {
    method: "POST",
    body: payload,
    auth: true,
  });
  return mapBlog(data);
}

export async function updateAdminBlog(id, payload) {
  const data = await apiFetch(`/api/v1/admin/blogs/${id}`, {
    method: "PUT",
    body: payload,
    auth: true,
  });
  return mapBlog(data);
}

export async function updateAdminBlogStatus(id, estado) {
  const data = await apiFetch(`/api/v1/admin/blogs/${id}/estado`, {
    method: "PATCH",
    body: { estado },
    auth: true,
  });
  return mapBlog(data);
}

export async function deleteAdminBlog(id) {
  await apiFetch(`/api/v1/admin/blogs/${id}`, { method: "DELETE", auth: true });
}
