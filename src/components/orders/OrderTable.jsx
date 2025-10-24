import { Link } from "react-router-dom";
import OrderBadge from "@/components/orders/OrderBadge.jsx";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(amount ?? 0);

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderTable = ({ orders }) => (
  <div className="admin-order-table">
    <table className="admin-table">
      <thead>
        <tr>
          <th scope="col">N° Orden</th>
          <th scope="col">Fecha</th>
          <th scope="col">Cliente</th>
          <th scope="col">Total</th>
          <th scope="col">Estado</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 && (
          <tr>
            <td colSpan={6} className="admin-table__empty">
              No se encontraron órdenes con los filtros actuales.
            </td>
          </tr>
        )}

        {orders.map((order) => (
          <tr key={order.id}>
            <td className="admin-table__cell--mono">{order.id}</td>
            <td>{formatDate(order.createdAt)}</td>
            <td>{order.customer}</td>
            <td>{formatCurrency(order.total)}</td>
            <td>
              <OrderBadge status={order.status} />
            </td>
            <td>
              <Link to={`/admin/ordenes/${order.id}`} className="admin-order-table__action">
                Ver detalle
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderTable;
