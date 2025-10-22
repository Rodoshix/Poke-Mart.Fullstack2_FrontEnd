// src/components/catalog/ProductCard.jsx
import { Link } from "react-router-dom";

const PLACEHOLDER = "/src/assets/img/tienda/productos/poke-Ball.png";
const resolveImg = (path) => {
  let clean = String(path ?? "").trim();
  if (!clean) return PLACEHOLDER;
  if (/^https?:\/\//i.test(clean)) return clean;

  clean = clean.replace(/^(?:\.\/|\.\.\/)+/, "").replace(/^\/+/, "");
  if (/^src\/assets\//.test(clean)) return `/${clean}`;

  if (/^(tienda|img|assets\/img)\//.test(clean)) {
    clean = `src/assets/${clean.replace(/^assets\//, "")}`;
    return `/${clean}`;
  }

  return `/src/assets/img/${clean}`;
};

export const ProductCard = ({ product }) => {
  const href = `/producto/${encodeURIComponent(product.id)}`;

  return (
    <article className="product-card card h-100">
      <Link
        className="product-card__media text-center p-3"
        to={href}
        aria-label={`Ver ${product.nombre}`}
      >
        <img
          className="product-card__img card-img-top img-fluid"
          src={resolveImg(product.imagen)}
          alt={product.nombre}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
      </Link>

      <div className="card-body d-flex flex-column">
        <h3 className="product-card__title h6 m-0">
          <Link className="text-reset text-decoration-none" to={href}>
            {product.nombre}
          </Link>
        </h3>

        <div className="text-muted small mb-2">
          {product.categoria ?? "—"}
        </div>

        <div className="product-card__footer d-flex justify-content-between align-items-center mt-auto">
          <span className="product-card__price text-primary fw-semibold">
            ${Number(product.precio ?? 0).toLocaleString("es-CL")}
          </span>
        </div>
      </div>
    </article>
  );
};
