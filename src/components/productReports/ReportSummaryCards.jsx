import { currencyFormatter, numberFormatter } from "@/components/productReports/reportFormatters.js";

const ReportSummaryCards = ({ summary }) => (
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
);

export default ReportSummaryCards;


