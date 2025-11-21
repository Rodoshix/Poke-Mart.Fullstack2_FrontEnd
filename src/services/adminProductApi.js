import { apiFetch } from "@/services/httpClient.js";

const slugify = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";

const mapProduct = (p = {}) => ({
  id: p.id,
  nombre: p.nombre ?? "",
  descripcion: p.descripcion ?? "",
  precio: Number(p.precio ?? 0),
  stock: Number(p.stock ?? 0),
  categoria: p.categoria ?? "",
  imagen: p.imagenUrl ?? "",
  descripcionCorta: p.descripcion ?? "",
});

export async function fetchAdminProducts() {
  const data = await apiFetch("/api/products");
  if (!Array.isArray(data)) return [];
  return data.map(mapProduct);
}

export async function fetchAdminProduct(id) {
  const data = await apiFetch(`/api/products/${id}`);
  return mapProduct(data);
}

export async function createAdminProduct(payload) {
  const body = {
    nombre: payload.nombre,
    descripcion: payload.descripcion ?? "",
    precio: Number(payload.precio ?? 0),
    stock: Number(payload.stock ?? 0),
    imagenUrl: payload.imagen ?? payload.imagenUrl ?? "",
    categoriaSlug: slugify(payload.categoria ?? "general"),
  };
  const data = await apiFetch("/api/products", { method: "POST", auth: true, body });
  return mapProduct(data);
}

export async function updateAdminProduct(id, payload) {
  const body = {
    nombre: payload.nombre,
    descripcion: payload.descripcion ?? "",
    precio: Number(payload.precio ?? 0),
    stock: Number(payload.stock ?? 0),
    imagenUrl: payload.imagen ?? payload.imagenUrl ?? "",
    categoriaSlug: slugify(payload.categoria ?? "general"),
  };
  const data = await apiFetch(`/api/products/${id}`, { method: "PUT", auth: true, body });
  return mapProduct(data);
}

export async function deleteAdminProduct(id) {
  await apiFetch(`/api/products/${id}`, { method: "DELETE", auth: true });
}
