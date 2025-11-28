// src/pages/tienda/CatalogPage.jsx
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import "@/assets/styles/catalog.css";
import { useCatalog } from "@/hooks/useCatalog";
import CatalogHeader from "@/components/catalog/CatalogHeader.jsx";
import ProductsGrid from "@/components/catalog/ProductsGrid.jsx";
import Pagination from "@/components/catalog/Pagination.jsx";
import PageBorders from "@/components/layout/PageBorders";
import { useEffect, useState } from "react";
import LoaderOverlay from "@/components/common/LoaderOverlay.jsx";

const PAGE_SIZE = 12;

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export default function CatalogPage() {
  const qs = useQuery();
  const initialQ = qs.get("q") || "";
  const [delayLoader, setDelayLoader] = useState(true);

  const {
    state: { q, cat, page },
    data: { categorias, items, maxPage },
    actions: { setQ, setCat, setPage, clearFilters },
  } = useCatalog({ pageSize: PAGE_SIZE, initialQ });

  useEffect(() => {
    const t = setTimeout(() => setDelayLoader(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const showLoader = delayLoader && (!items || items.length === 0);

  return (
    <>
      <PageBorders />

      <CatalogHeader
        q={q}
        cat={cat}
        categorias={categorias}
        onChangeQ={setQ}
        onChangeCat={setCat}
        onClear={clearFilters}
      />

      <div>.</div> {/* espacio */}

      <main className="site-main products container pb-5 flex-grow-1">
        {showLoader ? (
          <LoaderOverlay text="Cargando productos..." />
        ) : (
          <ProductsGrid items={items} />
        )}

        <Pagination
          page={page}
          maxPage={maxPage}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(maxPage, p + 1))}
        />
      </main>
    </>
  );
}
