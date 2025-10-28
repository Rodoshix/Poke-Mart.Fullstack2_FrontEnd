import { currencyFormatter, numberFormatter, percentFormatter } from "@/components/productReports/reportFormatters.js";
import ReportPanel from "@/components/productReports/ReportPanel.jsx";

const ReportFilteredProducts = ({ filteredProducts }) => (
  <ReportPanel
    title="Detalle de productos filtrados"
    subtitle={
      filteredProducts.length > 0
        ? `${numberFormatter.format(filteredProducts.length)} productos coinciden con los filtros.`
        : "No hay coincidencias con los filtros aplicados."
    }
  >
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
  </ReportPanel>
);

export default ReportFilteredProducts;



