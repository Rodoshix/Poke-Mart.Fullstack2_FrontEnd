// usado en CatalogPage.jsx y HomePage.jsx
// src/components/catalog/ProductCard.jsx
import { Link } from "react-router-dom";
import { resolveImg } from "@/utils/resolveImg";
import { money } from "@/utils/money";

const PLACEHOLDER = "/src/assets/img/tienda/productos/poke-Ball.png";

export const ProductCard = ({ product }) => {
  const href = `/producto/${encodeURIComponent(product.id)}`;
  const img = resolveImg(product.imagen);

  return (
    <article className="product-card card h-100">
      <Link className="product-card__media text-center p-3" to={href} aria-label={`Ver ${product.nombre}`}>
        <img
          className="product-card__img card-img-top img-fluid"
          src={img}
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

        <div className="text-muted small mb-2">{product.categoria ?? "—"}</div>

        <div className="product-card__footer d-flex justify-content-between align-items-center mt-auto">
          <span className="product-card__price text-primary fw-semibold">
            {money(product.precio)}
          </span>
        </div>
      </div>
    </article>
  );
};
