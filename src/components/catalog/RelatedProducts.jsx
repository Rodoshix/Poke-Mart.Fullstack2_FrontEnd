// src/components/catalog/RelatedProducts.jsx
import { ProductCard } from "@/components/catalog/ProductCard.jsx";

const PLACEHOLDER = "/src/assets/img/tienda/productos/poke-Ball.png";
const resolveImg = (path) => {
  let clean = String(path ?? "").trim();
  if (!clean) return PLACEHOLDER;
  if (/^https?:\/\//i.test(clean)) return clean;
  clean = clean.replace(/^(?:\.\/|\.\.\/)+/, "").replace(/^\/+/, "");
  if (!clean.startsWith("src/")) clean = `src/${clean}`;
  return `/${clean}`;
};

export function RelatedProducts({ items = [], title = "Productos relacionados" }) {
  if (!items.length) {
    return (
      <section className="related mt-5">
        <h2 className="h5 mb-3">{title}</h2>
        <div className="text-secondary small">Sin productos relacionados.</div>
      </section>
    );
  }

  const fixed = items.map((p) => ({ ...p, imagen: resolveImg(p.imagen) }));

  return (
    <section className="related mt-5">
      <h2 className="h5 mb-3">{title}</h2>
      <div className="row g-4">
        {fixed.map((p) => (
          <div className="col-12 col-sm-6 col-lg-3 d-flex" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
