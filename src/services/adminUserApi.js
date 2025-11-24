import { apiFetch } from "@/services/httpClient.js";

const mapUser = (u) => ({
  id: u.id,
  username: u.username,
  email: u.email,
  role: (u.role || "").toLowerCase(),
  active: u.active,
  registeredAt: u.createdAt,
  lastLoginAt: u.lastLoginAt,
  nombre: u.nombre,
  apellido: u.apellido,
  run: u.rut,
  fechaNacimiento: u.fechaNacimiento,
  region: u.region,
  comuna: u.comuna,
  direccion: u.direccion,
  avatarUrl: u.avatarUrl,
  telefono: u.telefono,
});

export async function fetchAdminUsers() {
  const data = await apiFetch("/api/v1/admin/users", { auth: true });
  if (!Array.isArray(data)) return [];
  return data.map(mapUser);
}

export async function fetchAdminUser(id) {
  const data = await apiFetch(`/api/v1/admin/users/${id}`, { auth: true });
  return data ? mapUser(data) : null;
}

export async function createAdminUser(payload) {
  const body = {
    email: payload.email,
    username: payload.username,
    password: payload.password || undefined,
    role: (payload.role || "cliente").toUpperCase(),
    nombre: payload.nombre,
    apellido: payload.apellido,
    rut: payload.run,
    fechaNacimiento: payload.fechaNacimiento,
    region: payload.region,
    comuna: payload.comuna,
    direccion: payload.direccion,
    telefono: payload.telefono,
    avatarUrl: payload.avatarUrl,
    active: payload.active ?? true,
  };
  const data = await apiFetch("/api/v1/admin/users", { method: "POST", auth: true, body });
  return mapUser(data);
}

export async function updateAdminUser(id, payload) {
  const body = {
    email: payload.email,
    username: payload.username,
    password: payload.password || undefined,
    role: (payload.role || "cliente").toUpperCase(),
    nombre: payload.nombre,
    apellido: payload.apellido,
    rut: payload.run,
    fechaNacimiento: payload.fechaNacimiento,
    region: payload.region,
    comuna: payload.comuna,
    direccion: payload.direccion,
    telefono: payload.telefono,
    avatarUrl: payload.avatarUrl,
    active: payload.active ?? true,
  };
  const data = await apiFetch(`/api/v1/admin/users/${id}`, { method: "PUT", auth: true, body });
  return mapUser(data);
}

export async function deactivateAdminUser(id) {
  await apiFetch(`/api/v1/admin/users/${id}`, { method: "DELETE", auth: true });
}

export async function setAdminUserActive(id, active) {
  const data = await apiFetch(`/api/v1/admin/users/${id}/status?active=${active ? "true" : "false"}`, {
    method: "PATCH",
    auth: true,
  });
  return mapUser(data);
}

export async function deleteAdminUser(id) {
  await apiFetch(`/api/v1/admin/users/${id}?hard=true`, { method: "DELETE", auth: true });
}
