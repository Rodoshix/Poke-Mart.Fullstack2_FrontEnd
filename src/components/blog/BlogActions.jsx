// usado en BlogDetailPage.jsx
// src/components/blog/BlogActions.jsx
import { Link } from "react-router-dom";

export default function BlogActions() {
  return (
    <div className="blog-entry__actions">
      <Link className="blog-entry__back" to="/blog">
        &larr; Volver al blog
      </Link>
    </div>
  );
}
