// usado en BlogPage.jsx
// src/components/blog/Blog.jsx
import blogsData from "@/data/blogs.json";
import BlogCard from "./BlogCard.jsx";

export default function Blog() {
  const blogs = Array.isArray(blogsData) ? blogsData : [];

  if (!blogs.length) {
    return (
      <div className="alert alert-info" role="status">
        Aún no hay publicaciones disponibles.
      </div>
    );
  }

  return (
    <section className="blog-grid" aria-live="polite">
      {blogs.map((b) => (
        <BlogCard key={b.id} blog={b} />
      ))}
    </section>
  );
}
