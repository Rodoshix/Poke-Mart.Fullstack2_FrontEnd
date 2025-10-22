// src/components/catalog/RelatedProducts.jsx
import { ProductCard } from "@/components/catalog/ProductCard.jsx";

export function RelatedProducts({ items = [], title = "Productos relacionados" }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <section className="related mt-5">
        <h2 className="h5 mb-3">{title}</h2>
        <div className="text-secondary small">Sin productos relacionados.</div>
      </section>
    );
  }

  return (
    <section className="related mt-5">
      <h2 className="h5 mb-3">{title}</h2>
      <div className="row g-4">
        {items.map((p) => (
          <div className="col-12 col-sm-6 col-lg-3 d-flex" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
