// src/components/blog/Blog.jsx
import { useEffect, useMemo, useState } from "react";
import blogsData from "@/data/blogs.json"; // ajusta si tu JSON está en otra ruta
import { Link } from "react-router-dom";

const FALLBACK_IMG = "https://placehold.co/600x400?text=Blog";

// Normaliza rutas de imagen (https, /src/assets, assets/…)
const resolveImg = (path) => {
  let p = String(path ?? "").trim();
  if (!p) return FALLBACK_IMG;
  if (/^https?:\/\//i.test(p)) return p;
  p = p.replace(/^(?:\.\/|\.\.\/)+/, "").replace(/^\/+/, "");
  // Ej: src/assets/tienda/..., assets/...
  if (/^src\/assets\//i.test(p)) return `/${p}`;
  const i = p.indexOf("assets/");
  if (i !== -1) return `/${p.slice(i)}`;
  return `/${p}`; // último recurso
};

const fmt = (iso) => {
  try {
    if (!iso) return "";
    const d = new Date(iso);
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "";
  }
};

const escapeHtml = (str = "") =>
  String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch] || ch);

export default function Blog() {
  // En vez de fetch, usamos el JSON importado (como hicimos en otras páginas)
  const blogs = useMemo(() => (Array.isArray(blogsData) ? blogsData : []), []);

  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(blogs);
  }, [blogs]);

  if (!items.length) {
    return (
      <div className="alert alert-info" role="status">
        Aún no hay publicaciones disponibles.
      </div>
    );
  }

  return (
    <section className="blog-grid" aria-live="polite">
      {items.map((blog) => {
        const date = blog.fecha ? `Publicado ${fmt(blog.fecha)}` : "";
        const categoria = blog.categoria ? ` | ${blog.categoria}` : "";
        const img = resolveImg(blog.imagen);
        // Ruta sugerida para detalle: /blog/:id (si aún no existe, este Link puede llevar a "#")
        const detailHref = `/blog/${encodeURIComponent(blog.id)}`;

        return (
          <article className="blog-card" key={blog.id}>
            <figure className="blog-card__image">
              <img
                src={img}
                alt={blog.titulo || "Publicación de blog"}
                loading="lazy"
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
              />
            </figure>
            <div className="blog-card__body">
              <span className="blog-card__meta">
                {escapeHtml(date)}
                {categoria && <>{categoria}</>}
              </span>
              <h2 className="blog-card__title">{escapeHtml(blog.titulo || "Título")}</h2>
              <p className="blog-card__excerpt">
                {escapeHtml(blog.descripcion || "Pronto más detalles…")}
              </p>
              {/* Cambia a <a href={detailHref}> si aún no tienes Route de detalle */}
              <Link className="blog-card__link" to={detailHref}>
                Leer más
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}
