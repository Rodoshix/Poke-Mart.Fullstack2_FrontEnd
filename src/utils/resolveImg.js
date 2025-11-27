import { productFallback, placeholderImg } from "@/assets/images.js";
import { resolveApiBaseUrl } from "@/services/apiConfig.js";

const assetModules = import.meta.glob("../assets/**/*", { eager: true, import: "default" });
const assetMap = Object.entries(assetModules).reduce((acc, [key, url]) => {
  const normalized = key.replace(/\\/g, "/").replace(/^\.\.\/?/, "/src/");
  acc[normalized] = url;
  return acc;
}, {});

const DEFAULT_PLACEHOLDER = placeholderImg || productFallback || "https://placehold.co/900x500?text=Imagen";

function tryResolveLocalAsset(raw) {
  if (!raw) return null;
  let p = raw.replace(/\\/g, "/").trim();
  p = p.replace(/^@\/?/, "src/");
  p = p.replace(/^\/+/, "");
  if (p.startsWith("src/")) p = p.slice(4);
  if (!p.startsWith("assets/")) return null;
  const candidate = `/src/${p}`;
  return assetMap[candidate] || null;
}

export function resolveImg(path) {
  const value = (path ?? "").toString().trim();
  if (!value) return DEFAULT_PLACEHOLDER;
  if (/^data:/i.test(value)) return value;
  if (/^https?:\/\//i.test(value)) return value;

  const local = tryResolveLocalAsset(value.replace(/^\/+/, ""));
  if (local) return local;

  const apiBase = resolveApiBaseUrl().replace(/\/+$/, "");
  if (value.startsWith("/")) {
    if (value.startsWith("/uploads")) {
      return apiBase ? `${apiBase}${value}` : value;
    }
    return value;
  }

  return DEFAULT_PLACEHOLDER;
}
