import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductFilters from "@/components/products/ProductFilters.jsx";
import ProductTable from "@/components/products/ProductTable.jsx";
import Paginator from "@/components/common/Paginator.jsx";
import useAuthSession from "@/hooks/useAuthSession.js";
import { deleteAdminProduct, fetchAdminProducts, setAdminProductActive } from "@/services/adminProductApi.js";
import useAdminProducts from "@/hooks/useAdminProducts.js";

const DEFAULT_SORT = "id:asc";
const PAGE_SIZE = 10;

const AdminProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuthSession();
  const role = (profile?.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const presetCategory = location.state?.presetCategory ?? "";
  const presetSearch = location.state?.presetSearch ?? "";
  const productsInitial = useAdminProducts();
  const loading = productsInitial?.loading;
  const loadError = productsInitial?.error;
  const [searchTerm, setSearchTerm] = useState(presetSearch);
  const [selectedCategory, setSelectedCategory] = useState(presetCategory);
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);
  const [currentPage, setCurrentPage] = useState(1);
  const [stockFilter, setStockFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    setProducts(productsInitial);
  }, [productsInitial]);

  const refresh = async () => {
    try {
      const data = await fetchAdminProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
  };

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
      const base = Number(product.stockBase ?? product.stock ?? 0);
      const current = Number(product.stock ?? 0);
      const ratio = base > 0 ? current / base : 1;
      const matchesStock =
        stockFilter === "all"
          ? true
          : stockFilter === "critical"
            ? ratio <= 0.1
            : ratio > 0.1 && ratio <= 0.3;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, stockFilter]);

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
        return `Se agrego el producto #${updatedProductId} al catalogo (almacenado localmente).`;
      case "updated":
        return `El producto #${updatedProductId ?? ""} fue actualizado (cambios locales).`;
      default:
        return "";
    }
  }, [status, updatedProductId]);
  const showFeedback = Boolean(feedbackMessage);
  const showActionFeedback = Boolean(actionMessage || actionError);

  useEffect(() => {
    if (!showFeedback) return undefined;
    const timeout = setTimeout(() => {
      navigate(location.pathname, { replace: true });
    }, 4000);
    return () => clearTimeout(timeout);
  }, [showFeedback, location.pathname, navigate]);

  useEffect(() => {
    if (!showActionFeedback) return undefined;
    const timeout = setTimeout(() => {
      setActionMessage("");
      setActionError("");
    }, 4000);
    return () => clearTimeout(timeout);
  }, [showActionFeedback, actionMessage, actionError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  useEffect(() => {
    if (presetCategory) {
      setSelectedCategory(presetCategory);
      setSearchTerm("");
      setSortOption(DEFAULT_SORT);
      setCurrentPage(1);
    }
  }, [presetCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRestoreDefaults = () => {
    refresh();
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption(DEFAULT_SORT);
    setCurrentPage(1);
    navigate(location.pathname, { replace: true });
  };

  const handleToggleActive = async (productId, nextActive) => {
    if (!productId) return;
    setProcessingId(productId);
    try {
      await setAdminProductActive(productId, nextActive);
      setActionMessage(`Producto #${productId} ${nextActive ? "activado" : "desactivado"} correctamente.`);
      setActionError("");
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo actualizar el estado del producto.";
      setActionMessage("");
      setActionError(message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (productId) => {
    if (!productId) return;
    const confirmed = window.confirm("Â¿Eliminar este producto de forma permanente? Esta acciÃ³n no se puede deshacer.");
    if (!confirmed) return;
    setProcessingId(productId);
    try {
      await deleteAdminProduct(productId);
      setActionMessage(`Producto #${productId} eliminado correctamente.`);
      setActionError("");
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo eliminar el producto.";
      setActionMessage("");
      setActionError(message);
    } finally {
      setProcessingId(null);
    }
  };

  const stockMetrics = useMemo(() => {
    let critical = 0;
    let low = 0;
    products.forEach((p) => {
      const base = Number(p.stockBase ?? p.stock ?? 0);
      const current = Number(p.stock ?? 0);
      if (base <= 0) return;
      const ratio = current / base;
      if (ratio <= 0.1) critical += 1;
      else if (ratio <= 0.3) low += 1;
    });
    return { critical, low };
  }, [products]);

  return (
    <section className="admin-paper admin-products">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Productos</h1>
        <p className="admin-page-subtitle">
          Gestiona el catalogo que se muestra en la tienda: revisa stock, precios e identifica productos criticos.
        </p>
        <div className="admin-products__summary-cards">
          <div className="admin-summary-card admin-summary-card--critical">
            <span className="admin-summary-card__label">Stock critico</span>
            <strong className="admin-summary-card__value">{stockMetrics.critical}</strong>
          </div>
          <div className="admin-summary-card admin-summary-card--low">
            <span className="admin-summary-card__label">Stock bajo</span>
            <strong className="admin-summary-card__value">{stockMetrics.low}</strong>
          </div>
        </div>
      </div>

      <div className="admin-products__actions">
        {loading && (
          <div className="admin-products__alert" role="status">
            Cargando productos...
          </div>
        )}
        {loadError && (
          <div className="admin-products__alert admin-products__alert--error" role="alert">
            {loadError}
          </div>
        )}
        {isAdmin ? (
          <>
            <Link to="/admin/productos/nuevo" className="admin-products__action-button admin-products__action-button--primary">
              + Agregar producto
            </Link>
            <Link to="/admin/productos/criticos" className="admin-products__action-button">
              Productos criticos
            </Link>
            <Link to="/admin/productos/reportes" className="admin-products__action-button">
              Reportes de productos
            </Link>
          </>
        ) : (
          <div className="admin-products__action-group">
            <div className="admin-products__filters-inline">
              <button
                type="button"
                className={`admin-products__action-button${stockFilter === "critical" ? " admin-products__action-button--ghost" : ""}`}
                onClick={() => setStockFilter("critical")}
                disabled={stockMetrics.critical === 0}
              >
                Ver críticos ({stockMetrics.critical})
              </button>
              <button
                type="button"
                className={`admin-products__action-button${stockFilter === "low" ? " admin-products__action-button--ghost" : ""}`}
                onClick={() => setStockFilter("low")}
                disabled={stockMetrics.low === 0}
              >
                Stock bajo ({stockMetrics.low})
              </button>
              {stockFilter !== "all" && (
                <button
                  type="button"
                  className="admin-products__action-button"
                  onClick={() => setStockFilter("all")}
                >
                  Ver todos
                </button>
              )}
            </div>
          </div>
        )}
        <button type="button" className="admin-products__action-button" onClick={handleRestoreDefaults}>
          Refrescar catalogo
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
      {showActionFeedback && (
        <div
          className={`admin-products__alert${actionError ? " admin-products__alert--error" : ""}`}
          role={actionError ? "alert" : "status"}
        >
          {actionError || actionMessage}
        </div>
      )}

      <ProductTable
        products={paginatedProducts}
        readOnly={!isAdmin}
        onToggleActive={isAdmin ? handleToggleActive : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        processingId={processingId}
      />

      <Paginator currentPage={currentPageClamped} totalPages={totalPages} onPageChange={handlePageChange} pageSize={PAGE_SIZE} totalItems={sortedProducts.length} />
    </section>
  );
};

export default AdminProducts;
