// src/pages/tienda/BlogDetailPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import blogsData from "@/data/blogs.json";
import "@/assets/styles/blogDetalle.css";

const BG_SIDE = "/src/assets/img/background-logo.png";

function resolveImg(path) {
  let p = (path ?? "").toString().trim();
  if (!p) return "https://placehold.co/900x500?text=Blog";
  if (/^https?:\/\//i.test(p)) return p;
  p = p.replace(/^(?:\.\/|\.\.\/)+/, "").replace(/^\/+/, "");
  p = p.replace(/^src\/(assets\/.*)$/i, "$1");
  if (p.startsWith("assets/")) return `/src/${p}`;
  const i = p.indexOf("assets/");
  if (i !== -1) return `/src/${p.slice(i)}`;
  return `/src/assets/${p}`;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const [notFound, setNotFound] = useState(false);

  const blog = useMemo(() => {
    const list = Array.isArray(blogsData) ? blogsData : [];
    const item = list.find((b) => String(b.id) === String(id));
    return item || null;
  }, [id]);

  useEffect(() => {
    setNotFound(!blog);
  }, [blog]);

  const fmtDate = (iso) => {
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
  };

  const extraParagraphs = (b) => {
    const base = b?.descripcion || "";
    const frags = [
      base,
      "Explora más a fondo las recomendaciones de nuestro equipo Poké Mart para que tu próxima travesía sea más cómoda y segura.",
      "Recuerda complementar estas sugerencias con tu estilo personal y la región que planeas visitar. Cada entrenador tiene necesidades únicas.",
    ];
    if (Array.isArray(b?.etiquetas) && b.etiquetas.length) {
      frags.push(`Etiquetas clave: ${b.etiquetas.map((t) => `#${t}`).join(", ")}.`);
    }
    // Evita repetidos/ vacíos
    return frags.filter((s, i, arr) => s && s.trim() && arr.indexOf(s) === i);
  };

  if (notFound) {
    return (
      <>
        <img src={BG_SIDE} className="left-border" alt="" aria-hidden="true" />
        <img src={BG_SIDE} className="right-border" alt="" aria-hidden="true" />
        <main className="site-main blog-detail container py-5">
          <nav className="blog-breadcrumb mb-4" aria-label="Migas de pan">
            <Link className="blog-breadcrumb__link" to="/">Home</Link>
            <span className="mx-2 text-body-secondary">/</span>
            <Link className="blog-breadcrumb__link" to="/blog">Blog</Link>
            <span className="mx-2 text-body-secondary">/</span>
            <span className="text-body-secondary">Detalle</span>
          </nav>

          <div className="alert alert-warning" role="alert">
            No encontramos la publicación solicitada.
          </div>
          <div className="mt-3">
            <Link className="btn btn-primary" to="/blog">Volver al blog</Link>
          </div>
        </main>
      </>
    );
  }

  const date = fmtDate(blog?.fecha);
  const paragraphs = extraParagraphs(blog);

  return (
    <>
      <img src={BG_SIDE} className="left-border" alt="" aria-hidden="true" />
      <img src={BG_SIDE} className="right-border" alt="" aria-hidden="true" />

      <main className="site-main blog-detail container py-5">
        <nav className="blog-breadcrumb mb-4" aria-label="Migas de pan">
          <Link className="blog-breadcrumb__link" to="/">Home</Link>
          <span className="mx-2 text-body-secondary">/</span>
          <Link className="blog-breadcrumb__link" to="/blog">Blog</Link>
          <span className="mx-2 text-body-secondary">/</span>
          <span id="breadcrumbTitle" className="text-body-secondary">
            {blog?.titulo || "Detalle"}
          </span>
        </nav>

        <article className="blog-entry" aria-live="polite">
          <figure className="blog-entry__media mb-0">
            <img
              src={resolveImg(blog?.imagen)}
              alt={blog?.titulo || "Imagen de la publicación"}
              loading="lazy"
              onError={(e) => (e.currentTarget.src = "https://placehold.co/900x500?text=Blog")}
            />
          </figure>

          <div className="blog-entry__body">
            <div className="blog-entry__meta">
              {date && <span>{date}</span>}
              {blog?.categoria && <span>| {blog.categoria}</span>}
            </div>

            <h1 className="blog-entry__title">{blog?.titulo}</h1>

            {blog?.descripcion ? (
              <p className="blog-entry__lead">{blog.descripcion}</p>
            ) : null}

            <div className="blog-entry__content">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {Array.isArray(blog?.etiquetas) && blog.etiquetas.length > 0 && (
              <ul className="blog-entry__tags">
                {blog.etiquetas.map((t, i) => (
                  <li key={i} className="blog-entry__tag">#{t}</li>
                ))}
              </ul>
            )}

            <div className="blog-entry__actions">
              <Link className="blog-entry__back" to="/blog">
                &larr; Volver al blog
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
