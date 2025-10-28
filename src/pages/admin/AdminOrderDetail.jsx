import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrderSummary from "@/components/orderDetail/OrderSummary.jsx";
import OrderItems from "@/components/orderDetail/OrderItems.jsx";
import useOrdersData from "@/hooks/useOrdersData.js";

const formatDateTime = (value) => {
  if (!value) return "No disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminOrderDetail = () => {
  const { id: orderId = "" } = useParams();
  const navigate = useNavigate();

  const orders = useOrdersData();
  const order = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    return list.find((item) => String(item.id) === String(orderId)) ?? null;
  }, [orders, orderId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section className="admin-paper admin-order-detail">
      <div className="admin-order-detail__header">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Detalle de orden</h1>
          <p className="admin-page-subtitle">
            Consulta la información del pedido, estado del envío y los artículos asociados a la boleta seleccionada.
          </p>
        </div>
        <button type="button" className="admin-order-detail__back" onClick={handleBack}>
          Volver
        </button>
      </div>

      {!order ? (
        <div className="admin-order-detail__empty">
          <h2>No encontramos la orden solicitada.</h2>
          <p>
            Verifica que el identificador sea correcto o regresa al listado de{" "}
            <Link to="/admin/ordenes">órdenes</Link> para seleccionar otra boleta.
          </p>
        </div>
      ) : (
        <>
          <OrderSummary order={order} />
          <OrderItems items={order.items} currency={order.currency} />

          {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 && (
            <section className="admin-order-timeline">
              <h3>Historial de estado</h3>
              <ol>
                {order.statusHistory
                  .slice()
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((entry) => (
                    <li key={`${entry.status}-${entry.timestamp}`}>
                      <span className="admin-order-timeline__label">{entry.label || entry.status}</span>
                      <span className="admin-order-timeline__date">{formatDateTime(entry.timestamp)}</span>
                    </li>
                  ))}
              </ol>
            </section>
          )}
        </>
      )}
    </section>
  );
};

export default AdminOrderDetail;
