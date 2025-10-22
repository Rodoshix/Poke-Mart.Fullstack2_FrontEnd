// usado en BlogDetailPage.jsx
// src/components/blog/BlogBreadcrumb.jsx
import { Link } from "react-router-dom";

export default function BlogBreadcrumb({ title = "Detalle" }) {
  return (
    <nav className="blog-breadcrumb mb-4" aria-label="Migas de pan">
      <Link className="blog-breadcrumb__link" to="/">Home</Link>
      <span className="mx-2 text-body-secondary">/</span>
      <Link className="blog-breadcrumb__link" to="/blog">Blog</Link>
      <span className="mx-2 text-body-secondary">/</span>
      <span id="breadcrumbTitle" className="text-body-secondary">{title}</span>
    </nav>
  );
}
