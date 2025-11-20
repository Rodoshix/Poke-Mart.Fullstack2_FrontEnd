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
    return { message: text };
  }
}

async function handle(response) {
  const data = await parseResponse(response);
  if (!response.ok) {
    const message = data?.message || data?.error || "No se pudo completar la solicitud";
    throw new Error(message);
  }
  return data;
}

export async function login({ identifier, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ identifier, password }),
  });
  return handle(response);
}

export async function register({ email, username, password, nombre, apellido }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ email, username, password, nombre, apellido }),
  });
  return handle(response);
}

export async function refreshToken(refreshToken) {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ refreshToken }),
  });
  return handle(response);
}

export { API_BASE_URL };
