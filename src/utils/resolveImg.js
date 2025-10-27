export function resolveImg(path) {
  let p = (path ?? "").toString().trim();
  if (!p) return "https://placehold.co/900x500?text=Blog";
  if (/^data:/i.test(p)) return p;
  if (/^https?:\/\//i.test(p)) return p;
  p = p.replace(/^(?:\.\/|\.\.\/)+/, "").replace(/^\/+/, "");
  p = p.replace(/^src\/(assets\/.*)$/i, "$1");
  if (p.startsWith("assets/")) return `/src/${p}`;
  const i = p.indexOf("assets/");
  if (i !== -1) return `/src/${p.slice(i)}`;
  return `/src/assets/${p}`;
}
