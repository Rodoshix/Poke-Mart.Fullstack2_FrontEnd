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
});

export async function fetchBlogs({ categoria, q } = {}) {
  const params = new URLSearchParams();
  if (categoria) params.set("categoria", categoria);
  if (q) params.set("q", q);
  const data = await apiFetch(`/api/blogs${params.toString() ? `?${params.toString()}` : ""}`);
  if (!Array.isArray(data)) return [];
  return data.map(mapBlog);
}

export async function fetchBlogBySlug(slug) {
  const data = await apiFetch(`/api/blogs/${encodeURIComponent(slug)}`);
  return mapBlog(data);
}
