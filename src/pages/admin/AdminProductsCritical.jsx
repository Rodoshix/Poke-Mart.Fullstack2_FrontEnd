import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useProductsData from "@/hooks/useProductsData.js";
import StockBadge, { getStockStatus } from "@/components/products/StockBadge.jsx";
import { resolveImg } from "@/utils/resolveImg.js";

const FILTERS = [
  { id: "critical", label: "Crítico (<10%)" },
  { id: "low", label: "Bajo (<30%)" },
  { id: "all", label: "Todo stock crítico/bajo" },
];

const severityOrder = {
  critico: 0,
  bajo: 1,
  saludable: 2,
  sobrante: 3,
  "sin-datos": 4,
};

const formatPercent = new Intl.NumberFormat("es-CL", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const AdminProductsCritical = () => {
  const products = useProductsData();
  const [selectedFilter, setSelectedFilter] = useState("critical");
  const [searchTerm, setSearchTerm] = useState("");

  const enriched = useMemo(() => {
    return (products ?? []).map((product) => {
      const stockBase = Number(product.stockBase ?? product.stock ?? 0);
      const stock = Number(product.stock ?? 0);
      const ratio = stockBase > 0 ? stock / stockBase : 1;
      const statusInfo = getStockStatus(stock, stockBase);
      const shortage = stockBase - stock;
      const image = resolveImg(product.imagen);
      return {
        ...product,
        stockBase,
        ratio,
        shortage,
        statusInfo,
        image,
      };
    });
  }, [products]);

  const metrics = useMemo(() => {
    const critical = enriched.filter((item) => item.ratio <= 0.1).length;
    const low = enriched.filter((item) => item.ratio > 0.1 && item.ratio <= 0.3).length;
    return {
      totalCritical: critical,
      totalLow: low,
      totalConcern: critical + low,
    };
  }, [enriched]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return enriched
      .filter((item) => {
        if (selectedFilter === "critical") {
          if (!(item.ratio <= 0.1)) return false;
        } else if (selectedFilter === "low") {
          if (!(item.ratio > 0.1 && item.ratio <= 0.3)) return false;
        } else if (selectedFilter === "all") {
          if (!(item.ratio <= 0.3)) return false;
        }
        if (!term) return true;
        return (
          item.nombre.toLowerCase().includes(term) ||
          String(item.id).includes(term) ||
          item.categoria.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        const severityA = severityOrder[a.statusInfo.status] ?? 99;
        const severityB = severityOrder[b.statusInfo.status] ?? 99;
        if (severityA !== severityB) return severityA - severityB;
        if (a.ratio !== b.ratio) return a.ratio - b.ratio;
        return a.nombre.localeCompare(b.nombre);
      });
  }, [enriched, selectedFilter, searchTerm]);

  return (
    <section className="admin-paper admin-products-critical">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Productos con stock crítico</h1>
        <p className="admin-page-subtitle">
          Prioriza el reabastecimiento identificando los productos que ya se encuentran por debajo del
          stock esperado.
        </p>
      </div>

      <div className="admin-products-critical__summary">
        <div>
          <span className="admin-products-critical__metric-label">Críticos (&lt;10%)</span>
          <strong className="admin-products-critical__metric-value">{metrics.totalCritical}</strong>
        </div>
        <div>
          <span className="admin-products-critical__metric-label">Bajos (&lt;30%)</span>
          <strong className="admin-products-critical__metric-value">{metrics.totalLow}</strong>
        </div>
        <div>
          <span className="admin-products-critical__metric-label">Total a revisar</span>
          <strong className="admin-products-critical__metric-value">{metrics.totalConcern}</strong>
        </div>
      </div>

      <div className="admin-products-critical__filters">
        <div className="admin-products-critical__filter-set">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`admin-products-critical__filter-button ${
                selectedFilter === filter.id ? "is-active" : ""
              }`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="admin-products-critical__search">
          <label htmlFor="critical-search" className="sr-only">
            Buscar producto
          </label>
          <input
            id="critical-search"
            type="search"
            placeholder="Buscar por nombre, ID o categoría"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="admin-product-table">
        <table className="admin-table admin-product-table__inner">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Categoría</th>
              <th scope="col">Stock actual</th>
              <th scope="col">Stock inicial</th>
              <th scope="col">% restante</th>
              <th scope="col">Estado</th>
              <th scope="col" className="admin-product-table__actions-header">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="admin-table__empty">
                  No hay productos críticos con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-table__product-cell">
                      {product.image ? (
                        <img src={product.image} alt={product.nombre} loading="lazy" />
                      ) : (
                        <span className="admin-product-table__placeholder" aria-hidden="true">
                          {String(product.nombre).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="admin-table__cell--mono">{product.id}</td>
                  <td>{product.nombre}</td>
                  <td>{product.categoria}</td>
                  <td>{product.stock}</td>
                  <td>{product.stockBase}</td>
                  <td>
                    {product.stockBase > 0
                      ? formatPercent.format(Math.max(product.ratio, 0))
                      : "—"}
                  </td>
                  <td>
                    <StockBadge stock={product.stock} stockBase={product.stockBase} />
                  </td>
                  <td>
                    <Link
                      to={`/admin/productos/${product.id}/editar`}
                      className="admin-product-table__action"
                    >
                      Reponer / Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminProductsCritical;
