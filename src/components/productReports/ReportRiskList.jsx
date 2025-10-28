import { numberFormatter, percentFormatter } from "@/components/productReports/reportFormatters.js";
import ReportPanel from "@/components/productReports/ReportPanel.jsx";

const ReportRiskList = ({ atRisk }) => (
  <ReportPanel
    title="Productos que requieren atención"
    subtitle="Los niveles de stock más bajos del catálogo filtrado."
  >
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
  </ReportPanel>
);

export default ReportRiskList;



