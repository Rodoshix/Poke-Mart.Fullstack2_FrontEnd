// usado por OfferCard.jsx
// src/components/offers/OffersEmpty.jsx
import { Link } from "react-router-dom";

export default function OffersEmpty() {
  return (
    <div className="alert alert-info">
      Por ahora no hay productos en oferta.
      <div className="mt-2">
        <Link className="btn btn-primary" to="/catalogo">Ir al catálogo</Link>
      </div>
    </div>
  );
}
