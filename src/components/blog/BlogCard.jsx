// usado en BlogPage.jsx
// src/components/blog/BlogCard.jsx
import { Link } from "react-router-dom";
import { resolveImg } from "@/utils/resolveImg";

const FALLBACK_IMG = "https://placehold.co/600x400?text=Blog";

function fmt(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default function BlogCard({ blog }) {
  const published = blog?.fechaPublicacion || blog?.fecha;
  const date = published ? `Publicado ${fmt(published)}` : "";
  const categoria = blog?.categoria ? ` | ${blog.categoria}` : "";
  const img = resolveImg(blog?.imagen);
  const slug = blog?.slug || blog?.id;
  const detailHref = `/blog/${encodeURIComponent(slug)}`;

  return (
    <article className="blog-card">
      <figure className="blog-card__image">
        <img
          src={img}
          alt={blog?.titulo || "Publicación de blog"}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
        />
      </figure>
      <div className="blog-card__body">
        <span className="blog-card__meta">
          {date}{categoria}
        </span>
        <h2 className="blog-card__title">{blog?.titulo || "Título"}</h2>
        <p className="blog-card__excerpt">
          {blog?.descripcion || "Pronto más detalles…"}
        </p>
        <Link className="blog-card__link" to={detailHref}>
          Leer más
        </Link>
      </div>
    </article>
  );
}
