export function resolveImg(path) {
  let p = (path ?? "").toString().trim();
  if (!p) return "https://placehold.co/900x500?text=Blog";
  if (/^data:/i.test(p)) return p;
  if (/^https?:\/\//i.test(p)) return p;
  const apiBase = (import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");
  // rutas absolutas servidas por el backend (p.e. /uploads/archivo.png)
  if (p.startsWith("/")) {
    // si es un recurso de uploads servidos por el backend, anteponer base
    if (p.startsWith("/uploads")) {
      return apiBase ? `${apiBase}${p}` : p;
    }
    return p;
  }
  p = p.replace(/^(?:\.\/|\.\.\/)+/, "").replace(/^\/+/, "");
  p = p.replace(/^src\/(assets\/.*)$/i, "$1");
  if (p.startsWith("assets/")) return `/src/${p}`;
  const i = p.indexOf("assets/");
  if (i !== -1) return `/src/${p.slice(i)}`;
  return `/src/assets/${p}`;
}
