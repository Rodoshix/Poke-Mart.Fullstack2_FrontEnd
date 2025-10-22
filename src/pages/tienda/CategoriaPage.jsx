// src/pages/tienda/CategoriaPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import "@/assets/styles/categoria.css";
import ProductsGrid from "@/components/catalog/ProductsGrid.jsx";
import Pagination from "@/components/catalog/Pagination.jsx";
import PageBorders from "@/components/layout/PageBorders";
import CategorySidebar from "@/components/catalog/CategorySidebar.jsx";
import SortToolbar from "@/components/catalog/SortToolbar.jsx";
import productsData from "@/data/productos.json";

const PAGE_SIZE = 12;

const normalize = (p = {}) => ({
  id: p.id ?? "",
  nombre: p.nombre ?? "Producto",
  categoria: p.categoria ?? "—",
  precio: Number(p.precio ?? 0),
  stock: Number(p.stock ?? 0),
  imagen: p.imagen || "/src/assets/img/placeholder.png",
});

const uniqueCats = (arr) =>
  Array.from(new Set(arr.map((p) => p.categoria).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );

export default function CategoriaPage() {
  useEffect(() => {
    document.body.classList.add("page--catalog");
    return () => document.body.classList.remove("page--catalog");
  }, []);

  const params = useParams();                 // opcionalmente /categoria/:slug
  const [searchParams, setSearchParams] = useSearchParams();

  const [sort, setSort] = useState(searchParams.get("sort") || "recomendados");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const all = useMemo(() => {
    const raw = Array.isArray(productsData) ? productsData : [];
    return raw.map(normalize);
  }, []);

  const categorias = useMemo(() => uniqueCats(all), [all]);

  // categoría seleccionada (query param o slug)
  const selectedCat = searchParams.get("cat") || params?.slug || "";

  // filtro por categoría
  const filtered = useMemo(() => {
    return all.filter((p) => !selectedCat || p.categoria === selectedCat);
  }, [all, selectedCat]);

  // orden
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "precio-asc":  arr.sort((a, b) => a.precio - b.precio); break;
      case "precio-desc": arr.sort((a, b) => b.precio - a.precio); break;
      case "nombre-asc":  arr.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
      case "nombre-desc": arr.sort((a, b) => b.nombre.localeCompare(a.nombre)); break;
      default: /* recomendados: orden original */ break;
    }
    return arr;
  }, [filtered, sort]);

  const maxPage = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const items = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  // sync a la URL
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    if (sort) next.set("sort", sort); else next.delete("sort");
    if (selectedCat) next.set("cat", selectedCat); else next.delete("cat");
    setSearchParams(next, { replace: true });
  }, [sort, selectedCat, page]);

  // resetear página cuando cambian filtros/orden
  useEffect(() => setPage(1), [sort, selectedCat]);

  return (
    <>
      <PageBorders />
      <main className="site-main container pb-5 flex-grow-1">
        {/* migas */}
        <nav className="mb-3" aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Página principal</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{selectedCat || "Categorías"}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* sidebar filtros */}
          <aside className="col-12 col-lg-3">
            <h2 className="h5 fw-bold mb-3">Filtros</h2>
            <CategorySidebar
              categorias={categorias}
              value={selectedCat}
              onChange={(cat) => setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (cat) next.set("cat", cat); else next.delete("cat");
                next.set("page", "1");
                return next;
              })}
            />
          </aside>

          {/* contenido */}
          <section className="col-12 col-lg-9">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <SortToolbar sort={sort} onChange={setSort} />
              {/* pill decorativo tipo "trends" */}
              <button type="button" className="btn btn-light border rounded-pill px-3" disabled>
                <strong className="me-1">trends</strong>
              </button>
            </div>

            <ProductsGrid items={items} />

            <Pagination
              page={page}
              maxPage={maxPage}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(maxPage, p + 1))}
            />
          </section>
        </div>
      </main>
    </>
  );
}
