import blogsData from "@/data/blogs.json";
import BlogCard from "./BlogCard.jsx";

export default function Blog({ blogs }) {
  const source = Array.isArray(blogs)
    ? blogs
    : Array.isArray(blogsData)
      ? blogsData
      : [];

  if (!source.length) {
    return (
      <div className="alert alert-info" role="status">
        Aún no hay publicaciones disponibles.
      </div>
    );
  }

  return (
    <section className="blog-grid" aria-live="polite">
      {source.map((b) => (
        <BlogCard key={b.id || b.slug} blog={b} />
      ))}
    </section>
  );
}
