import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useProductsData from "@/hooks/useProductsData.js";
import { getStockStatus } from "@/components/products/StockBadge.jsx";

const numberFormatter = new Intl.NumberFormat("es-CL");
const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("es-CL", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const SORT_OPTIONS = [
  { value: "inventory:desc", label: "Mayor inventario" },
  { value: "ratio:asc", label: "Menor % de stock" },
  { value: "products:desc", label: "Más productos" },
  { value: "critical:desc", label: "Más productos críticos" },
  { value: "name:asc", label: "Nombre A-Z" },
];

const AdminCategories = () => {
  const products = useProductsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("inventory:desc");

  const categories = useMemo(() => {
    const map = new Map();

    (products ?? []).forEach((product) => {
      const name = (product?.categoria ?? "Sin categoría").toString().trim() || "Sin categoría";
      const stock = Number(product?.stock ?? 0);
      const stockBaseCandidate = Number(product?.stockBase ?? product?.stock ?? 0);
      const stockBase =
        Number.isFinite(stockBaseCandidate) && stockBaseCandidate > 0 ? stockBaseCandidate : stock;
      const price = Number(product?.precio ?? 0);

      const entry =
        map.get(name) ??
        {
          name,
          products: 0,
          stock: 0,
          stockBase: 0,
          inventoryValue: 0,
          priceSum: 0,
          minPrice: Number.POSITIVE_INFINITY,
          maxPrice: 0,
          criticalProducts: 0,
          lowProducts: 0,
          healthyProducts: 0,
          productSamples: [],
        };

      entry.products += 1;
      entry.stock += stock;
      entry.stockBase += stockBase;
      entry.inventoryValue += stock * price;
      entry.priceSum += price;
      entry.minPrice = Math.min(entry.minPrice, price);
      entry.maxPrice = Math.max(entry.maxPrice, price);

      const statusInfo = getStockStatus(stock, stockBase);
      if (statusInfo.status === "critico") entry.criticalProducts += 1;
      else if (statusInfo.status === "bajo") entry.lowProducts += 1;
      else entry.healthyProducts += 1;

      entry.productSamples.push({
        id: product.id,
        nombre: product.nombre,
        stock,
        stockBase,
        ratio: stockBase > 0 ? stock / stockBase : 1,
      });

      map.set(name, entry);
    });

    return Array.from(map.values()).map((entry) => {
      const ratio = entry.stockBase > 0 ? entry.stock / entry.stockBase : 1;
      const statusInfo = getStockStatus(entry.stock, entry.stockBase);
      return {
        ...entry,
        ratio,
        statusInfo,
        averagePrice: entry.products > 0 ? entry.priceSum / entry.products : 0,
        minPrice: entry.minPrice !== Number.POSITIVE_INFINITY ? entry.minPrice : 0,
        productSamples: entry.productSamples
          .sort((a, b) => a.ratio - b.ratio)
          .slice(0, 3),
      };
    });
  }, [products]);

  const metrics = useMemo(() => {
    const totalCategories = categories.length;
    const totalProducts = categories.reduce((acc, cat) => acc + cat.products, 0);
    const totalInventory = categories.reduce((acc, cat) => acc + cat.inventoryValue, 0);
    const atRiskCategories = categories.filter((cat) => cat.ratio <= 0.3).length;
    return { totalCategories, totalProducts, totalInventory, atRiskCategories };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return categories.filter(
      (category) =>
        !term ||
        category.name.toLowerCase().includes(term) ||
        category.products.toString().includes(term),
    );
  }, [categories, searchTerm]);

  const sortedCategories = useMemo(() => {
    const list = [...filteredCategories];
    switch (sortOption) {
      case "ratio:asc":
        list.sort((a, b) => a.ratio - b.ratio);
        break;
      case "products:desc":
        list.sort((a, b) => b.products - a.products);
        break;
      case "critical:desc":
        list.sort((a, b) => b.criticalProducts - a.criticalProducts);
        break;
      case "name:asc":
        list.sort((a, b) => a.name.localeCompare(b.name, "es"));
        break;
      case "inventory:desc":
      default:
        list.sort((a, b) => b.inventoryValue - a.inventoryValue);
    }
    return list;
  }, [filteredCategories, sortOption]);

  return (
    <section className="admin-paper admin-categories">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categorías</h1>
        <p className="admin-page-subtitle">
          Resume el estado del catálogo agrupado por categoría y detecta dónde enfocar el inventario.
        </p>
      </div>

      <div className="admin-categories__summary">
        <article>
          <span className="admin-categories__summary-label">Categorías activas</span>
          <strong className="admin-categories__summary-value">
            {numberFormatter.format(metrics.totalCategories)}
          </strong>
          <small>Total de categorías derivadas del catálogo.</small>
        </article>
        <article>
          <span className="admin-categories__summary-label">Productos registrados</span>
          <strong className="admin-categories__summary-value">
            {numberFormatter.format(metrics.totalProducts)}
          </strong>
          <small>Productos totales agrupados en categorías.</small>
        </article>
        <article>
          <span className="admin-categories__summary-label">Inventario estimado</span>
          <strong className="admin-categories__summary-value">
            {currencyFormatter.format(metrics.totalInventory)}
          </strong>
          <small>Valor aproximado considerando stock actual.</small>
        </article>
        <article>
          <span className="admin-categories__summary-label">Categorías en riesgo</span>
          <strong className="admin-categories__summary-value">
            {numberFormatter.format(metrics.atRiskCategories)}
          </strong>
          <small>Categorías con stock promedio por debajo del 30%.</small>
        </article>
      </div>

      <div className="admin-categories__filters">
        <div className="admin-categories__filter">
          <label className="sr-only" htmlFor="category-search">
            Buscar categoría
          </label>
          <input
            id="category-search"
            type="search"
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="admin-categories__filter">
          <label className="sr-only" htmlFor="category-sort">
            Ordenar resultados
          </label>
          <select
            id="category-sort"
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-categories__filter admin-categories__filter--actions">
          <Link to="/admin/productos/criticos" className="admin-categories__action">
            Ver productos críticos
          </Link>
          <Link to="/admin/productos/reportes" className="admin-categories__action">
            Reporte completo
          </Link>
        </div>
      </div>

      <div className="admin-categories__grid">
        {sortedCategories.length === 0 ? (
          <div className="admin-table__empty">
            No se encontraron categorías con los criterios especificados.
          </div>
        ) : (
          sortedCategories.map((category) => (
            <article
              key={category.name}
              className={`admin-categories__card admin-categories__card--${category.statusInfo.status}`}
            >
              <header className="admin-categories__card-header">
                <div>
                  <h2 className="admin-categories__card-title">{category.name}</h2>
                  <span className="admin-categories__card-subtitle">
                    {numberFormatter.format(category.products)} productos
                  </span>
                </div>
                <span className={`admin-stock-badge admin-stock-badge--${category.statusInfo.status}`}>
                  {category.statusInfo.label}
                </span>
              </header>

              <div className="admin-categories__progress">
                <div
                  className={`admin-categories__progress-bar admin-categories__progress-bar--${category.statusInfo.status}`}
                  style={{ width: `${Math.min(category.ratio, 1) * 100}%` }}
                />
                <span>{percentFormatter.format(Math.max(category.ratio, 0))} del stock base</span>
              </div>

              <dl className="admin-categories__stats">
                <div>
                  <dt>Stock actual</dt>
                  <dd>
                    {numberFormatter.format(category.stock)}{" "}
                    <span className="admin-categories__stat-hint">
                      base {numberFormatter.format(category.stockBase)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Inventario estimado</dt>
                  <dd>{currencyFormatter.format(category.inventoryValue)}</dd>
                </div>
                <div>
                  <dt>Precio promedio</dt>
                  <dd>
                    {currencyFormatter.format(category.averagePrice)}{" "}
                    <span className="admin-categories__stat-hint">
                      {currencyFormatter.format(category.minPrice)} - {currencyFormatter.format(category.maxPrice)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Distribución stock</dt>
                  <dd className="admin-categories__distribution">
                    <span title="Crítico">
                      {numberFormatter.format(category.criticalProducts)} crítico
                    </span>
                    <span title="Bajo">
                      {numberFormatter.format(category.lowProducts)} bajo
                    </span>
                    <span title="Saludable">
                      {numberFormatter.format(category.healthyProducts)} saludable
                    </span>
                  </dd>
                </div>
              </dl>

              {category.productSamples.length > 0 && (
                <div className="admin-categories__top-list">
                  <h3>Necesitan atención</h3>
                  <ul>
                    {category.productSamples.map((product) => (
                      <li key={product.id}>
                        <Link to={`/admin/productos/${product.id}/editar`}>{product.nombre}</Link>
                        <span>
                          {numberFormatter.format(product.stock)}/
                          {numberFormatter.format(product.stockBase)} •{" "}
                          {percentFormatter.format(Math.max(product.ratio, 0))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="admin-categories__card-footer">
                  <Link
                    to="/admin/productos"
                    state={{ presetCategory: category.name }}
                    className="admin-categories__link"
                  >
                    Ver productos de la categoría
                  </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default AdminCategories;
