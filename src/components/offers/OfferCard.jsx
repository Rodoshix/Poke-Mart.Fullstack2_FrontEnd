// usado por OfferCard.jsx
// src/components/offers/OfferCard.jsx
import { Link } from "react-router-dom";
import { money } from "@/utils/money";
import { countdown } from "@/lib/offers";

const FALLBACK = "/src/assets/img/tienda/productos/poke-Ball.png";

export default function OfferCard({ product }) {
  const out = product.stock <= 0;
  const showBadge = product.offer.discountPct >= 5;
  const href = `/producto/${product.id}`;

  return (
    <article className="offer-card h-100">
      <div className="offer-card__media">
        <img
          className="offer-card__img"
          src={product.img}
          alt={product.nombre}
          onError={(e) => (e.currentTarget.src = FALLBACK)}
        />
        {showBadge ? <span className="offer-badge">-{product.offer.discountPct}%</span> : null}
      </div>
      <div className="offer-card__body">
        <h3 className="offer-card__title" title={product.nombre}>{product.nombre}</h3>
        <div className="offer-card__prices">
          <span className="offer-card__price">{money(product.offer.price)}</span>
          <span className="offer-card__base text-muted text-decoration-line-through">
            {money(product.offer.basePrice)}
          </span>
        </div>
        {product.offer.expiresInMs != null && (
          <div className="offer-card__ends text-secondary small">
            Termina en {countdown(product.offer.expiresInMs)}
          </div>
        )}
        <Link
          className={`btn w-100 mt-2 ${out ? "btn-outline-secondary" : "btn-primary"}`}
          to={href}
          aria-label="Ver oferta"
        >
          {out ? "Sin stock" : "Ver oferta"}
        </Link>
        <Link className="offer-card__link" to={href}>
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
