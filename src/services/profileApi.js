import { apiFetch } from "@/services/httpClient.js";

const mapProfile = (p) => ({
  id: p?.id ?? null,
  username: p?.username ?? "",
  role: (p?.role || "").toLowerCase(),
  nombre: p?.nombre ?? "",
  apellido: p?.apellido ?? "",
  email: p?.email ?? "",
  rut: p?.rut ?? "",
  direccion: p?.direccion ?? "",
  region: p?.region ?? "",
  comuna: p?.comuna ?? "",
  fechaNacimiento: p?.fechaNacimiento ?? "",
  telefono: p?.telefono ?? "",
  avatarUrl: p?.avatarUrl ?? "",
});

export async function fetchProfile() {
  const data = await apiFetch("/api/v1/profile", { auth: true });
  return data ? mapProfile(data) : null;
}

export async function updateProfile(payload) {
  const data = await apiFetch("/api/v1/profile", {
    method: "PUT",
    auth: true,
    body: payload,
  });
  return data ? mapProfile(data) : null;
}
