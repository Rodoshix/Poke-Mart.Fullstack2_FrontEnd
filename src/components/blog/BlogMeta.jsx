// usado en BlogDetailPage.jsx
// src/components/blog/BlogMeta.jsx
function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogMeta({ fecha, categoria }) {
  const date = fmtDate(fecha);
  if (!date && !categoria) return null;
  return (
    <div className="blog-entry__meta">
      {date && <span>{date}</span>}
      {categoria && <span>| {categoria}</span>}
    </div>
  );
}
