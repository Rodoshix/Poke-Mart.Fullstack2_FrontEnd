const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-CL");
const percentFormatter = new Intl.NumberFormat("es-CL", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ReportResults = ({
  summary,
  categoryStats = [],
  atRisk = [],
  filteredProducts = [],
}) => (
  <div className="admin-product-reports__results">
    <div className="admin-product-reports__summary">
      <article>
        <span className="admin-product-reports__summary-label">Productos totales</span>
        <strong className="admin-product-reports__summary-value">
          {numberFormatter.format(summary.totalProducts ?? 0)}
        </strong>
      </article>

      <article>
        <span className="admin-product-reports__summary-label">Categorías activas</span>
        <strong className="admin-product-reports__summary-value">
          {numberFormatter.format(summary.totalCategories ?? 0)}
        </strong>
      </article>

      <article>
        <span className="admin-product-reports__summary-label">Stock disponible</span>
        <strong className="admin-product-reports__summary-value">
          {numberFormatter.format(summary.totalStock ?? 0)}
        </strong>
        <small>{currencyFormatter.format(summary.totalStockValue ?? 0)} en vitrina</small>
      </article>

      <article>
        <span className="admin-product-reports__summary-label">Productos en riesgo</span>
        <strong className="admin-product-reports__summary-value">
          {numberFormatter.format(summary.totalAtRisk ?? 0)}
        </strong>
        <small>{numberFormatter.format(summary.totalCritical ?? 0)} críticos</small>
      </article>
    </div>

    <div className="admin-product-reports__grid">
      <section className="admin-product-reports__panel">
        <header>
          <h2>Desglose por categoría</h2>
          <p>Volumen y valor aproximado del inventario agrupado por categoría.</p>
        </header>
        <div className="admin-product-reports__table-wrapper">
          <table className="admin-product-reports__table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Productos</th>
                <th>Stock actual</th>
                <th>Stock base</th>
                <th>Valor inventario</th>
                <th>Prom. precio</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-table__empty">
                    No hay categorías para mostrar.
                  </td>
                </tr>
              ) : (
                categoryStats.map((category) => (
                  <tr key={category.name}>
                    <td>{category.name}</td>
                    <td>{numberFormatter.format(category.products)}</td>
                    <td>{numberFormatter.format(category.stock)}</td>
                    <td>{numberFormatter.format(category.stockBase)}</td>
                    <td>{currencyFormatter.format(category.inventoryValue)}</td>
                    <td>{currencyFormatter.format(category.averagePrice)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-product-reports__panel">
        <header>
          <h2>Productos que requieren atención</h2>
          <p>Los niveles de stock más bajos del catálogo filtrado.</p>
        </header>
        <ul className="admin-product-reports__risk-list">
          {atRisk.length === 0 ? (
            <li className="admin-product-reports__risk-empty">
              Todos los productos filtrados presentan un stock saludable.
            </li>
          ) : (
            atRisk.map((product) => (
              <li key={product.id}>
                <div>
                  <strong>{product.nombre}</strong>
                  <span>{product.categoria}</span>
                </div>
                <div>
                  <span className="admin-product-reports__risk-stock">
                    {product.stock}/{product.stockBase}
                  </span>
                  <span className="admin-product-reports__risk-ratio">
                    {percentFormatter.format(Math.max(product.ratio, 0))}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>

    <section className="admin-product-reports__panel">
      <header>
        <h2>Detalle de productos filtrados</h2>
        <p>
          {filteredProducts.length > 0
            ? `${numberFormatter.format(filteredProducts.length)} productos coinciden con los filtros.`
            : "No hay coincidencias con los filtros aplicados."}
        </p>
      </header>
      <div className="admin-product-table">
        <table className="admin-table admin-product-table__inner">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Stock base</th>
              <th>% restante</th>
              <th>Precio</th>
              <th>Valor inventario</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-table__empty">
                  Ajusta los filtros para ver resultados.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="admin-table__cell--mono">{product.id}</td>
                  <td>{product.nombre}</td>
                  <td>{product.categoria}</td>
                  <td>{numberFormatter.format(product.stock)}</td>
                  <td>{numberFormatter.format(product.stockBase)}</td>
                  <td>
                    {product.stockBase > 0
                      ? percentFormatter.format(Math.max(product.ratio, 0))
                      : "—"}
                  </td>
                  <td>{currencyFormatter.format(product.precio)}</td>
                  <td>{currencyFormatter.format(product.precio * product.stock)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

export default ReportResults;
