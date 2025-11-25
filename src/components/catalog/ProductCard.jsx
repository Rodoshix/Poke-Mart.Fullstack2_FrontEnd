// usado en CatalogPage.jsx y HomePage.jsx
// src/components/catalog/ProductCard.jsx
import { Link } from "react-router-dom";
import { resolveImg } from "@/utils/resolveImg";
import { money } from "@/utils/money";
import { getOfferInfo } from "@/lib/offers";

const PLACEHOLDER = "/src/assets/img/tienda/productos/poke-Ball.png";

export const ProductCard = ({ product }) => {
  const href = `/producto/${encodeURIComponent(product.id)}`;
  const img = resolveImg(product.imagen);
  const offer = product.oferta ?? getOfferInfo({
    ...product,
    discountPct: product.discountPct ?? product.offer?.discountPct ?? 0,
    endsAt: product.endsAt ?? product.offer?.endsAt ?? null,
  });
  const basePrice = product.precioBase ?? product.precio ?? 0;
  const price = offer.onSale ? offer.price : basePrice;

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

        <div className="text-muted small mb-2">{product.categoria ?? "Sin categoria"}</div>

        <div className="product-card__footer d-flex justify-content-between align-items-center mt-auto">
          <div className="product-card__pricing">
            {offer.onSale && (
              <span className="product-card__discount badge text-bg-warning text-dark">-{offer.discountPct}%</span>
            )}
            <div className="product-card__prices-row d-flex align-items-baseline gap-2">
              {offer.onSale && (
                <span className="product-card__old-price text-muted text-decoration-line-through small">
                  {money(basePrice)}
                </span>
              )}
              <span className={`product-card__price fw-semibold ${offer.onSale ? "text-danger" : "text-primary"}`}>
                {money(price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
