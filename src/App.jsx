import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import useAuthSession from "@/hooks/useAuthSession.js";

import HomePage from "@/pages/tienda/HomePage.jsx";
import CatalogPage from "@/pages/tienda/CatalogPage.jsx";
import ProductDetailPage from "@/pages/tienda/ProductDetailPage.jsx";
import LoginPage from "@/pages/tienda/LoginPage.jsx";
import CartPage from "@/pages/tienda/CartPage.jsx";
import NosotrosPage from "@/pages/tienda/NosotrosPage.jsx";
import ContactoPage from "@/pages/tienda/ContactoPage.jsx";
import RegistroPage from "@/pages/tienda/RegistroPage.jsx";
import BlogPage from "@/pages/tienda/BlogPage.jsx";
import BlogDetailPage from "./pages/tienda/BlogDetailPage.jsx";
import OffersPage from "@/pages/tienda/OffersPage.jsx";
import CheckoutPage from "@/pages/tienda/CheckoutPage";
import CheckoutSuccessPage from "@/pages/tienda/CheckoutSuccessPage.jsx";
import CheckoutErrorPage from "@/pages/tienda/CheckoutErrorPage.jsx";
import CategoriaPage from "@/pages/tienda/CategoriaPage.jsx";

import AdminLayout from "@/pages/admin/AdminLayout.jsx";
import AdminDashboard from "@/pages/admin/AdminDashboard.jsx";
import AdminOrders from "@/pages/admin/AdminOrders.jsx";
import AdminOrderDetail from "@/pages/admin/AdminOrderDetail.jsx";
import AdminProducts from "@/pages/admin/AdminProducts.jsx";
import AdminProductEdit from "@/pages/admin/AdminProductEdit.jsx";
import AdminProductCreate from "@/pages/admin/AdminProductCreate.jsx";
import AdminProductsCritical from "@/pages/admin/AdminProductsCritical.jsx";
import AdminProductsReports from "@/pages/admin/AdminProductsReports.jsx";
import AdminCategories from "@/pages/admin/AdminCategories.jsx";
import AdminUsers from "@/pages/admin/AdminUsers.jsx";
import AdminUserEdit from "@/pages/admin/AdminUserEdit.jsx";
import AdminUserHistory from "@/pages/admin/AdminUserHistory.jsx";
import AdminOffers from "@/pages/admin/AdminOffers.jsx";
import AdminReports from "@/pages/admin/AdminReports.jsx";
import AdminProfile from "@/pages/admin/AdminProfile.jsx";
import AdminReviews from "@/pages/admin/AdminReviews.jsx";

const ReviewsPage = () => <h1 className="h3">Reseñas</h1>;
const NotFound    = () => <div className="text-center"><h1 className="display-4">404</h1></div>;

const StoreLayout = () => (
  <div className="d-flex flex-column min-vh-100 app-shell">
    <Header cartCount={0} />
    <main className="my-4 flex-grow-1 app-main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  const { session } = useAuthSession();
  const isAuthenticated = Boolean(session);

  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="ordenes" element={<AdminOrders />} />
        <Route path="ordenes/:id" element={<AdminOrderDetail />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="productos/nuevo" element={<AdminProductCreate />} />
        <Route path="productos/:id/editar" element={<AdminProductEdit />} />
        <Route path="productos/criticos" element={<AdminProductsCritical />} />
        <Route path="productos/reportes" element={<AdminProductsReports />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="usuarios" element={<AdminUsers />} />
        <Route path="usuarios/nuevo" element={<AdminUserEdit />} />
        <Route path="usuarios/:id" element={<AdminUserEdit />} />
        <Route path="usuarios/:id/historial" element={<AdminUserHistory />} />
        <Route path="ofertas" element={<AdminOffers />} />
        <Route path="resenas" element={<AdminReviews />} />
        <Route path="reportes" element={<AdminReports />} />
        <Route path="perfil" element={<AdminProfile />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      <Route path="/" element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="producto/:id" element={<ProductDetailPage />} />
        <Route path="reseñas" element={<ReviewsPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="nosotros" element={<NosotrosPage />} />
        <Route path="contacto" element={<ContactoPage />} />
        <Route
          path="login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="registro"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <RegistroPage />
          }
        />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogDetailPage />} />
        <Route path="ofertas" element={<OffersPage />} />
        <Route path="compra" element={<CheckoutPage />} />
        <Route path="compra/exito" element={<CheckoutSuccessPage />} />
        <Route path="compra/error" element={<CheckoutErrorPage />} />
        <Route path="categoria" element={<CategoriaPage />} />
        <Route path="categoria/:slug" element={<CategoriaPage />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
