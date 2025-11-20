import { ensureFreshSession } from "@/services/authService.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function handle(response) {
  const data = await parseResponse(response);
  if (!response.ok) {
    const message = data?.message || data?.error || `Error ${response.status}`;
    throw new Error(message);
  }
  return data;
}

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
  const session = await ensureFreshSession();
  if (!session?.token) throw new Error("No autenticado");

  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: "GET",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session.token}`,
    },
  });
  const data = await handle(response);
  if (!Array.isArray(data)) return [];
  return data.map(mapUser);
}
