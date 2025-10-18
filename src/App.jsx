import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";

// IMPORTA EL HOME REAL
import HomePage from "@/pages/tienda/HomePage.jsx";

// (opcional) stubs temporales para las otras rutas
const CatalogPage = () => <h1 className="h3">Catálogo</h1>;
const ReviewsPage = () => <h1 className="h3">Reseñas</h1>;
const CartPage    = () => <h1 className="h3">Carrito</h1>;
const LoginPage   = () => <h1 className="h3">Login</h1>;
const NotFound    = () => <div className="text-center"><h1 className="display-4">404</h1></div>;

export default () => (
  <div className="d-flex flex-column min-vh-100 app-shell">
    <Header cartCount={0} />
    <main className="my-4 flex-grow-1 app-main">
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* <- AQUÍ EL HOME REAL */}
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/reseñas" element={<ReviewsPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </main>
    <Footer />
  </div>
);