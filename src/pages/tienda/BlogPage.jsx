// src/pages/tienda/BlogPage.jsx
import { useEffect } from "react";
import "@/assets/styles/blog.css";
import Blog from "@/components/blog/Blog.jsx";
import PageBorders from "@/components/layout/PageBorders";

export default function BlogPage() {
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
            Consejos y relatos para acompañar tu aventura Poké&nbsp;Mart.
          </p>
        </header>
        <Blog />
      </main>
    </>
  );
}
