// usado en CatalogPage.jsx
// src/components/catalog/ProductsGrid.jsx
import { ProductCard } from "@/components/catalog/ProductCard.jsx";

export default function ProductsGrid({ items }) {
  return (
    <div className="products__grid row g-4 justify-content-center" aria-live="polite">
      {items.length === 0 ? (
        <div className="products__empty col-12 text-center">No encontramos productos.</div>
      ) : (
        items.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-3 d-flex">
            <ProductCard product={p} />
          </div>
        ))
      )}
    </div>
  );
}
