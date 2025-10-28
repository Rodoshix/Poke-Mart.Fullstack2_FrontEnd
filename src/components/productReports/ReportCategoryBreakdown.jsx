import { currencyFormatter, numberFormatter } from "@/components/productReports/reportFormatters.js";
import ReportPanel from "@/components/productReports/ReportPanel.jsx";

const ReportCategoryBreakdown = ({ categoryStats }) => (
  <ReportPanel
    title="Desglose por categoría"
    subtitle="Volumen y valor aproximado del inventario agrupado por categoría."
  >
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
  </ReportPanel>
);

export default ReportCategoryBreakdown;



