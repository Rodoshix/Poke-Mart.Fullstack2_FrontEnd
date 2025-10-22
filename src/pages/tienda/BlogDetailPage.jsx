// src/pages/tienda/BlogDetailPage.jsx
import { useParams } from "react-router-dom";
import "@/assets/styles/blogDetalle.css";
import BlogBreadcrumb from "@/components/blog/BlogBreadcrumb";
import BlogNotFound from "@/components/blog/BlogNotFound";
import BlogMedia from "@/components/blog/BlogMedia";
import BlogMeta from "@/components/blog/BlogMeta";
import BlogTags from "@/components/blog/BlogTags";
import BlogActions from "@/components/blog/BlogActions";
import { useBlogById } from "@/hooks/useBlogById";

const BG_SIDE = "/src/assets/img/background-logo.png";

function extraParagraphs(b) {
  const base = b?.descripcion || "";
  const frags = [
    base,
    "Explora más a fondo las recomendaciones de nuestro equipo Poké Mart para que tu próxima travesía sea más cómoda y segura.",
    "Recuerda complementar estas sugerencias con tu estilo personal y la región que planeas visitar. Cada entrenador tiene necesidades únicas.",
  ];
  if (Array.isArray(b?.etiquetas) && b.etiquetas.length) {
    frags.push(`Etiquetas clave: ${b.etiquetas.map((t) => `#${t}`).join(", ")}.`);
  }
  return frags.filter((s, i, arr) => s && s.trim() && arr.indexOf(s) === i);
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const { blog, notFound } = useBlogById(id);

  if (notFound) return <BlogNotFound bgSide={BG_SIDE} />;

  const paragraphs = extraParagraphs(blog);

  return (
    <>
      <img src={BG_SIDE} className="left-border" alt="" aria-hidden="true" />
      <img src={BG_SIDE} className="right-border" alt="" aria-hidden="true" />

      <main className="site-main blog-detail container py-5">
        <BlogBreadcrumb title={blog?.titulo || "Detalle"} />

        <article className="blog-entry" aria-live="polite">
          <BlogMedia imagen={blog?.imagen} alt={blog?.titulo} />

          <div className="blog-entry__body">
            <BlogMeta fecha={blog?.fecha} categoria={blog?.categoria} />

            <h1 className="blog-entry__title">{blog?.titulo}</h1>

            {blog?.descripcion ? (
              <p className="blog-entry__lead">{blog.descripcion}</p>
            ) : null}

            <div className="blog-entry__content">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <BlogTags etiquetas={blog?.etiquetas} />
            <BlogActions />
          </div>
        </article>
      </main>
    </>
  );
}
