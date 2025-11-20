const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function parseJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: defaultHeaders,
  });
  const data = await parseJson(res);
  if (!res.ok) {
    const msg = data?.message || data?.error || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

const mapProduct = (p) => {
  if (!p) return null;
  const offer = p.offer || {};
  return {
    id: p.id,
    nombre: p.nombre ?? p.name ?? "",
    descripcion: p.descripcion ?? p.description ?? "",
    categoria: p.categoria ?? p.category ?? null,
    precio: Number(p.precio ?? p.price ?? 0),
    stock: Number(p.stock ?? 0),
    imagen: p.imagenUrl ?? p.imagen ?? "",
    discountPct: offer.discountPct ?? p.discountPct ?? 0,
    endsAt: offer.endsAt ?? p.endsAt ?? null,
    offer,
  };
};

export async function fetchProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const data = await request(`/api/products${query}`);
  if (!Array.isArray(data)) return [];
  return data.map(mapProduct).filter(Boolean);
}

export async function fetchProduct(id) {
  const data = await request(`/api/products/${id}`);
  return mapProduct(data);
}

export async function fetchOffers() {
  const data = await request("/api/offers");
  if (!Array.isArray(data)) return [];
  return data.map(mapProduct).filter(Boolean);
}

export { API_BASE_URL };
