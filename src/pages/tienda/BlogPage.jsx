import { useEffect } from "react";
import "@/assets/styles/blog.css";
import Blog from "@/components/blog/Blog.jsx";
import PageBorders from "@/components/layout/PageBorders";
import LoaderOverlay from "@/components/common/LoaderOverlay.jsx";
import { useBlogs } from "@/hooks/useBlogs.js";

export default function BlogPage() {
  const { blogs, loading, error } = useBlogs();

  useEffect(() => {
    document.body.classList.add("page--blog");
    return () => document.body.classList.remove("page--blog");
  }, []);

  return (
    <>
      <PageBorders />

      <main className="site-main blog-main container py-5">
        <header className="blog-hero text-center mb-5">
          <span className="badge rounded-pill text-bg-light">Historias &amp; consejos</span>
          <h1 className="blog-hero__title mt-3">Bitácora del entrenador</h1>
          <p className="blog-hero__lead text-secondary">
            Consejos y relatos para acompañar tu aventura Poké Mart.
          </p>
        </header>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? <LoaderOverlay text="Cargando blogs..." /> : <Blog blogs={blogs} />}
      </main>
    </>
  );
}
