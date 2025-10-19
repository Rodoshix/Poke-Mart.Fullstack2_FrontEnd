import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";

import HomePage from "@/pages/tienda/HomePage.jsx";
import CatalogPage from "@/pages/tienda/CatalogPage.jsx";
import ProductDetailPage from "@/pages/tienda/ProductDetailPage.jsx";
import LoginPage from "@/pages/tienda/LoginPage.jsx";
import CartPage from "@/pages/tienda/CartPage.jsx";

const ReviewsPage = () => <h1 className="h3">Reseñas</h1>;
const NotFound    = () => <div className="text-center"><h1 className="display-4">404</h1></div>;

export default () => (
  <div className="d-flex flex-column min-vh-100 app-shell">
    <Header cartCount={0} />
    <main className="my-4 flex-grow-1 app-main">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />
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