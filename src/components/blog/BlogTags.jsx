// usado en BlogDetailPage.jsx
// src/components/blog/BlogTags.jsx
export default function BlogTags({ etiquetas }) {
  if (!Array.isArray(etiquetas) || etiquetas.length === 0) return null;
  return (
    <ul className="blog-entry__tags">
      {etiquetas.map((t, i) => (
        <li key={i} className="blog-entry__tag">#{t}</li>
      ))}
    </ul>
  );
}
