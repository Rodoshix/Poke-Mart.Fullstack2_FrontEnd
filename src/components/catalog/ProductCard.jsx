// src/components/catalog/ProductCard.jsx
import { Link } from "react-router-dom";

export const ProductCard = ({ product }) => {
  if (!product) return null;
  const {
    id,
    nombre,
    imagen = "/src/assets/img/placeholder.png",
    categoria = "—",
    precio = 0,
  } = product;

  return (
    <article className="product-card card h-100">
      <Link
        className="product-card__media text-center p-3"
        to={`/producto/${encodeURIComponent(id)}`}
        aria-label={`Ver ${nombre}`}
      >
        <img className="product-card__img card-img-top img-fluid" src={imagen} alt={nombre} />
      </Link>

      <div className="product-card__body card-body d-flex flex-column">
        <h3 className="product-card__title h6 card-title mb-1">{nombre}</h3>

        <div className="product-card__footer">
          <span className="product-card__category">{categoria}</span>
          <span className="product-card__price text-primary">
            ${Number(precio).toLocaleString("es-CL")}
          </span>
        </div>
      </div>
    </article>
  );
};
