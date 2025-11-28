import { ensureFreshSession } from "@/services/authService.js";
import { clearAuth } from "@/components/auth/session";
import { API_BASE_URL } from "@/services/apiConfig.js";

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
  // Evitar preflight en GET: no enviar Content-Type si no hay body
  if (method?.toUpperCase() === "GET") {
    delete options.headers["Content-Type"];
  }

  const response = await fetch(url, options);
  const data = await parseResponse(response);

  if (response.status === 401) {
    clearAuth();
    if (auth && typeof window !== "undefined") {
      const currentPath = window.location?.pathname || "";
      if (!currentPath.startsWith("/login")) {
        const params = new URLSearchParams();
        if (currentPath) {
          params.set("redirect", currentPath.startsWith("/admin") ? "admin" : currentPath);
        }
        const query = params.toString();
        window.location.href = `/login${query ? `?${query}` : ""}`;
      }
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Error ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export { API_BASE_URL };
