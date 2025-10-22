// usado en BlogDetailPage.jsx
// src/components/blog/BlogMedia.jsx
import { resolveImg } from "@/utils/resolveImg";

export default function BlogMedia({ imagen, alt }) {
  return (
    <figure className="blog-entry__media mb-0">
      <img
        src={resolveImg(imagen)}
        alt={alt || "Imagen de la publicación"}
        loading="lazy"
        onError={(e) => (e.currentTarget.src = "https://placehold.co/900x500?text=Blog")}
      />
    </figure>
  );
}
