import { formatDateTime } from "@/components/orderDetail/orderSummaryUtils.js";

const OrderSummaryPayment = ({ payment }) => (
  <article className="admin-order-summary__card">
    <h3 className="admin-order-summary__card-title">Pago</h3>
    <dl className="admin-order-summary__list">
      <div>
        <dt>Método</dt>
        <dd>{payment?.method || "No informado"}</dd>
      </div>
      <div>
        <dt>Estado</dt>
        <dd>{payment?.status || "Sin estado"}</dd>
      </div>
      <div>
        <dt>Transacción</dt>
        <dd>{payment?.transactionId || "—"}</dd>
      </div>
      <div>
        <dt>Capturado</dt>
        <dd>{payment?.capturedAt ? formatDateTime(payment.capturedAt) : "No registrado"}</dd>
      </div>
    </dl>
  </article>
);

export default OrderSummaryPayment;

