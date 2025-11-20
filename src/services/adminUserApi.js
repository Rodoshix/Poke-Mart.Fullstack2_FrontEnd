import { apiFetch } from "@/services/httpClient.js";

const mapUser = (u) => ({
  id: u.id,
  username: u.username,
  email: u.email,
  role: (u.role || "").toLowerCase(),
  active: u.active,
  registeredAt: u.createdAt,
  nombre: u.nombre,
  apellido: u.apellido,
  run: u.rut,
  fechaNacimiento: u.fechaNacimiento,
  region: u.region,
  comuna: u.comuna,
  direccion: u.direccion,
  avatarUrl: u.avatarUrl,
});

export async function fetchAdminUsers() {
  const data = await apiFetch("/api/admin/users", { auth: true });
  if (!Array.isArray(data)) return [];
  return data.map(mapUser);
}
