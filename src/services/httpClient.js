import { ensureFreshSession } from "@/services/authService.js";
import { clearAuth } from "@/components/auth/session";

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

export async function apiFetch(path, { method = "GET", headers, body, auth = false } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  let resolvedHeaders = { ...defaultHeaders, ...(headers || {}) };

  if (auth) {
    const session = await ensureFreshSession();
    if (!session?.token) {
      throw new Error("No autenticado");
    }
    resolvedHeaders = {
      ...resolvedHeaders,
      Authorization: `Bearer ${session.token}`,
    };
  }

  const options = { method, headers: resolvedHeaders };
  if (body !== undefined) {
    const isForm = body instanceof FormData;
    options.body = isForm || typeof body === "string" ? body : JSON.stringify(body);
    if (isForm) {
      delete options.headers["Content-Type"];
    }
  }

  const response = await fetch(url, options);
  const data = await parseResponse(response);

  if (response.status === 401 && auth) {
    clearAuth();
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Error ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export { API_BASE_URL };
