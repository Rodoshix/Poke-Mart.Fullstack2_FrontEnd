import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductFilters from "@/components/products/ProductFilters.jsx";
import ProductTable from "@/components/products/ProductTable.jsx";
import Paginator from "@/components/common/Paginator.jsx";
import {
  getAllProducts,
  subscribeToProductChanges,
  PRODUCT_STORAGE_KEY,
  resetProducts,
} from "@/services/productService.js";

const DEFAULT_SORT = "id:asc";
const PAGE_SIZE = 10;

const AdminProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(() => getAllProducts());

  useEffect(() => {
    const refresh = () => setProducts(getAllProducts());
    const unsubscribe = subscribeToProductChanges(refresh);

    if (typeof window !== "undefined") {
      const onStorage = (event) => {
        if (event.key === null || event.key === PRODUCT_STORAGE_KEY) {
          refresh();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        unsubscribe();
        window.removeEventListener("storage", onStorage);
      };
    }

    return unsubscribe;
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      if (product?.categoria) set.add(product.categoria);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        String(product.id).includes(searchTerm.trim()) ||
        product.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesCategory = selectedCategory ? product.categoria === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const [key, direction] = sortOption.split(":");
    const multiplier = direction === "asc" ? 1 : -1;
    return [...filteredProducts].sort((a, b) => {
      if (key === "price") {
        return (a.precio - b.precio) * multiplier;
      }
      if (key === "stock") {
        return (a.stock - b.stock) * multiplier;
      }
      if (key === "id") {
        return (a.id - b.id) * multiplier;
      }
      return 0;
    });
  }, [filteredProducts, sortOption]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const currentPageClamped = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (currentPageClamped - 1) * PAGE_SIZE;
    return sortedProducts.slice(start, start + PAGE_SIZE);
  }, [sortedProducts, currentPageClamped]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption(DEFAULT_SORT);
    setCurrentPage(1);
  };

  const status = location.state?.status;
  const updatedProductId = location.state?.productId;
  const feedbackMessage = useMemo(() => {
    switch (status) {
      case "created":
        return `Se agregó el producto #${updatedProductId} al catálogo (almacenado localmente).`;
      case "updated":
        return `El producto #${updatedProductId ?? ""} fue actualizado (cambios locales).`;
      case "reset":
        return "El catálogo se restauró a los productos originales del proyecto.";
      default:
        return "";
    }
  }, [status, updatedProductId]);
  const showFeedback = Boolean(feedbackMessage);

  useEffect(() => {
    if (!showFeedback) return undefined;
    const timeout = setTimeout(() => {
      navigate(location.pathname, { replace: true });
    }, 4000);
    return () => clearTimeout(timeout);
  }, [showFeedback, location.pathname, navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRestoreDefaults = () => {
    const confirmed =
      typeof window === "undefined" ? true : window.confirm("¿Restaurar el catálogo original?");
    if (!confirmed) return;
    resetProducts();
    const refreshed = getAllProducts();
    setProducts(refreshed);
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption(DEFAULT_SORT);
    setCurrentPage(1);
    navigate(location.pathname, { replace: true, state: { status: "reset" } });
  };

  return (
    <section className="admin-paper admin-products">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Productos</h1>
        <p className="admin-page-subtitle">
          Gestiona el catálogo que se muestra en la tienda: revisa stock, precios e identifica productos críticos.
        </p>
      </div>

      <div className="admin-products__actions">
        <Link to="/admin/productos/nuevo" className="admin-products__action-button admin-products__action-button--primary">
          + Agregar producto
        </Link>
        <Link to="/admin/productos/criticos" className="admin-products__action-button">
          Productos críticos
        </Link>
        <Link to="/admin/productos/reportes" className="admin-products__action-button">
          Reportes de productos
        </Link>
        <button type="button" className="admin-products__action-button admin-products__action-button--danger" onClick={handleRestoreDefaults}>
          Restaurar catálogo
        </button>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        categories={categories}
        sortOption={sortOption}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortOption}
        onReset={searchTerm || selectedCategory || sortOption !== DEFAULT_SORT ? handleResetFilters : undefined}
      />

      {showFeedback && (
        <div className="admin-products__alert" role="status">
          {feedbackMessage}
        </div>
      )}

      <ProductTable products={paginatedProducts} />

      <Paginator currentPage={currentPageClamped} totalPages={totalPages} onPageChange={handlePageChange} pageSize={PAGE_SIZE} totalItems={sortedProducts.length} />
    </section>
  );
};

export default AdminProducts;
