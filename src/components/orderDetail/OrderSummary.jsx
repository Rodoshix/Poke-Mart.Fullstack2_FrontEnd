import OrderBadge from "@/components/orders/OrderBadge.jsx";
import OrderSummaryCustomer from "@/components/orderDetail/OrderSummaryCustomer.jsx";
import OrderSummaryPayment from "@/components/orderDetail/OrderSummaryPayment.jsx";
import OrderSummaryShipping from "@/components/orderDetail/OrderSummaryShipping.jsx";
import OrderSummaryTotals from "@/components/orderDetail/OrderSummaryTotals.jsx";
import { formatDateTime } from "@/components/orderDetail/orderSummaryUtils.js";

const OrderSummary = ({ order }) => {
  if (!order) return null;

  const {
    id,
    status,
    customer,
    customerEmail,
    customerPhone,
    createdAt,
    updatedAt,
    summary,
    payment,
    shipping,
    notes,
    currency = "CLP",
  } = order;

  return (
    <section className="admin-order-summary">
      <header className="admin-order-summary__header">
        <div>
          <h2 className="admin-order-summary__title">Orden {id}</h2>
          <p className="admin-order-summary__subtitle">
            Creada el {formatDateTime(createdAt)}, última actualización el {formatDateTime(updatedAt)}.
          </p>
        </div>
        <OrderBadge status={status} />
      </header>

      <div className="admin-order-summary__grid">
        <OrderSummaryCustomer
          customer={customer}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
        />
        <OrderSummaryPayment payment={payment} />
        <OrderSummaryShipping shipping={shipping} />
        <OrderSummaryTotals summary={summary} total={order.total} currency={currency} />
      </div>

      {notes && (
        <div className="admin-order-summary__notes">
          <h3>Notas internas</h3>
          <p>{notes}</p>
        </div>
      )}
    </section>
  );
};

export default OrderSummary;

