import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import productsData from "@/data/productos.json";
import { ProductCard } from "@/components/catalog/ProductCard.jsx";
import "@/assets/styles/catalog.css";

const PAGE_SIZE = 12;

const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
};

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
        a.localeCompare(b, "es")
    );

const CatalogPage = () => {
    const qs = useQuery();

    const [q, setQ] = useState(qs.get("q") || "");
    const [cat, setCat] = useState("");
    const [page, setPage] = useState(1);

    const all = useMemo(
        () =>
            (productsData ?? [])
                .map(normalize)
                .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
        []
    );

    const categorias = useMemo(() => uniqueCats(all), [all]);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        return all.filter((p) => {
            const okTerm =
                !term ||
                p.nombre.toLowerCase().includes(term) ||
                p.categoria.toLowerCase().includes(term);
            const okCat = !cat || p.categoria === cat;
            return okTerm && okCat;
        });
    }, [all, q, cat]);

    const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    const items = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    useEffect(() => setPage(1), [q, cat]);

    return (
        <>
            <img
                src="/src/assets/img/background-logo.png"
                className="left-border"
                alt=""
                aria-hidden="true"
                decoding="async"
                loading="lazy"
            />
            <img
                src="/src/assets/img/background-logo.png"
                className="right-border"
                alt=""
                aria-hidden="true"
                decoding="async"
                loading="lazy"
            />

            <section className="products-header container pt-3 pb-3">
                <h1 className="text-center display-5 mb-4">PRODUCTOS</h1>

                <form className="products-filters row g-3 justify-content-center">
                    <div className="col-12 col-md-5">
                        <label className="form-label products-filters__label" htmlFor="q">
                            Buscar
                        </label>
                        <input
                            id="q"
                            type="search"
                            className="form-control"
                            placeholder="Nombre o categoría"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>

                    <div className="col-6 col-md-3">
                        <label className="form-label products-filters__label" htmlFor="cat">
                            Categoría
                        </label>
                        <select
                            id="cat"
                            className="form-select"
                            value={cat}
                            onChange={(e) => setCat(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {categorias.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-6 col-md-2 d-grid">
                        <label className="form-label invisible">.</label>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setQ("");
                                setCat("");
                            }}
                        >
                            Limpiar
                        </button>
                    </div>
                </form>
            </section>

            <main className="site-main products container pb-5 flex-grow-1">
                <div className="products__grid row g-4 justify-content-center" aria-live="polite">
                    {items.length === 0 ? (
                        <div className="products__empty col-12 text-center">No encontramos productos.</div>
                    ) : (
                        items.map((p) => (
                            <div key={p.id} className="col-12 col-sm-6 col-lg-3 d-flex">
                                <Link to={`/producto/${encodeURIComponent(p.id)}`} className="w-100 text-decoration-none text-reset">
                                    <ProductCard product={p} />
                                </Link>
                            </div>
                        ))
                    )}
                </div>

                <nav className="products__pagination d-flex justify-content-center mt-4">
                    <ul className="pagination">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                type="button"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Anterior
                            </button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link">{page}</span>
                        </li>
                        <li className={`page-item ${page === maxPage ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                type="button"
                                onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                            >
                                Siguiente
                            </button>
                        </li>
                    </ul>
                </nav>
            </main>
        </>
    );
};

export default CatalogPage;
