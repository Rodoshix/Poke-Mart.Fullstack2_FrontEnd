import { formatCurrency } from "@/components/orderDetail/orderSummaryUtils.js";

const OrderSummaryTotals = ({ summary, total, currency }) => (
  <article className="admin-order-summary__card admin-order-summary__card--highlight">
    <h3 className="admin-order-summary__card-title">Resumen de cobros</h3>
    <ul className="admin-order-summary__totals">
      <li>
        <span>Productos (IVA incluido)</span>
        <span>{formatCurrency(summary?.subtotal ?? 0, currency)}</span>
      </li>
      <li>
        <span>Envío</span>
        <span>{formatCurrency(summary?.shipping ?? 0, currency)}</span>
      </li>
      {summary?.discount ? (
        <li>
          <span>Descuentos</span>
          <span>-{formatCurrency(summary.discount, currency)}</span>
        </li>
      ) : null}
      <li className="admin-order-summary__totals-total">
        <span>Total pagado</span>
        <span>{formatCurrency(summary?.total ?? total ?? 0, currency)}</span>
      </li>
      <li className="admin-order-summary__totals-note">
        <span>IVA incluido (19%)</span>
        <span>{formatCurrency(summary?.taxes ?? 0, currency)}</span>
      </li>
    </ul>
  </article>
);

export default OrderSummaryTotals;

