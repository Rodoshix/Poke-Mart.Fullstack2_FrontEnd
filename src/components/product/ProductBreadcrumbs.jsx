// usado por ProductDetailPage.jsx
// src/components/product/ProductBreadcrumbs.jsx
import { Link } from "react-router-dom";

export default function ProductBreadcrumbs({ name = "Detalle" }) {
  return (
    <nav className="breadcrumb-wrapper mb-3" aria-label="Breadcrumb">
      <ol className="breadcrumb small">
        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
        <li className="breadcrumb-item"><Link to="/catalogo">Productos</Link></li>
        <li className="breadcrumb-item active" aria-current="page">{name}</li>
      </ol>
    </nav>
  );
}
