// usado en BlogDetailPage.jsx
// src/components/blog/BlogNotFound.jsx
import { Link } from "react-router-dom";

export default function BlogNotFound({ bgSide }) {
  return (
    <>
      <img src={bgSide} className="left-border" alt="" aria-hidden="true" />
      <img src={bgSide} className="right-border" alt="" aria-hidden="true" />
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
