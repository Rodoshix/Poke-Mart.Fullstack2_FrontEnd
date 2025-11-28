// src/pages/tienda/BlogDetailPage.jsx
import { useParams } from "react-router-dom";
import "@/assets/styles/blogDetalle.css";
import BlogBreadcrumb from "@/components/blog/BlogBreadcrumb";
import BlogNotFound from "@/components/blog/BlogNotFound";
import BlogMedia from "@/components/blog/BlogMedia";
import BlogMeta from "@/components/blog/BlogMeta";
import BlogTags from "@/components/blog/BlogTags";
import BlogActions from "@/components/blog/BlogActions";
import PageBorders from "@/components/layout/PageBorders";
import LoaderOverlay from "@/components/common/LoaderOverlay.jsx";
import { useBlogDetail } from "@/hooks/useBlogDetail.js";
import { backgroundLogo } from "@/assets/images.js";

const BG_SIDE = backgroundLogo;

function paragraphsFromBlog(blog) {
  if (blog?.contenido) {
    return blog.contenido
      .split(/\r?\n\r?\n|\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  if (blog?.descripcion) {
    return [blog.descripcion].filter(Boolean);
  }
  return [];
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { blog, loading, error, notFound } = useBlogDetail(slug);

  if (notFound && !loading) return <BlogNotFound bgSide={BG_SIDE} />;

  const paragraphs = paragraphsFromBlog(blog);
  const metaFecha = blog?.fechaPublicacion || blog?.fecha;

  return (
    <>
      <PageBorders />

      <main className="site-main blog-detail container py-5">
        {loading && <LoaderOverlay text="Cargando publicación..." />}

        {error && !loading && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {blog && !loading && (
          <>
            <BlogBreadcrumb title={blog?.titulo || "Detalle"} />

            <article className="blog-entry" aria-live="polite">
              <BlogMedia imagen={blog?.imagen} alt={blog?.titulo} />

              <div className="blog-entry__body">
                <BlogMeta fecha={metaFecha} categoria={blog?.categoria} />

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
          </>
        )}
      </main>
    </>
  );
}
