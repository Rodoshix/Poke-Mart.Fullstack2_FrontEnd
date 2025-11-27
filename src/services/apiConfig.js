export function resolveApiBaseUrl() {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  if (envBase) return envBase;
  if (typeof window !== "undefined") {
    const host = window.location?.hostname || "";
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8080";
    }
  }
  return "https://poke-martfullstack2backend-production.up.railway.app";
}

export const API_BASE_URL = resolveApiBaseUrl().replace(/\/+$/, "");
