import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrderSummary from "@/components/orderDetail/OrderSummary.jsx";
import OrderItems from "@/components/orderDetail/OrderItems.jsx";
import useOrdersData from "@/hooks/useOrdersData.js";
import { updateAdminOrder } from "@/services/orderApi.js";
import { useEffect } from "react";

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

  const [estado, setEstado] = useState(order?.status ?? "");
  const [notas, setNotas] = useState(order?.notes ?? order?.notas ?? order?.summary?.notes ?? "");
  const [referencia, setReferencia] = useState(order?.shipping?.address?.reference ?? order?.referenciaEnvio ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (order) {
      setEstado(order.status ?? "");
      setNotas(order.notes ?? order.notas ?? order.summary?.notes ?? "");
      setReferencia(order.shipping?.address?.reference ?? order.referenciaEnvio ?? "");
    }
  }, [order]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!order) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        estado: estado ? estado.toUpperCase() : undefined,
        notas: notas ?? "",
        referenciaEnvio: referencia ?? "",
      };
      await updateAdminOrder(order.backendId ?? order.id, payload);
      setSuccess("Orden actualizada correctamente.");
    } catch (err) {
      setError(err?.message || "No se pudo actualizar la orden.");
    } finally {
      setSaving(false);
    }
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

          <section className="admin-order-detail__form">
            <h3>Actualizar orden</h3>
            <form onSubmit={handleUpdate} className="admin-order-update-form">
              <div className="admin-order-update-form__grid">
                <div>
                  <label htmlFor="order-status">Estado</label>
                  <select
                    id="order-status"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  >
                    <option value="">Selecciona estado</option>
                    <option value="creada">Creada</option>
                    <option value="pagada">Pagada</option>
                    <option value="enviada">Enviada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="order-reference">Referencia de envío</label>
                  <input
                    id="order-reference"
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Instrucciones o referencia"
                  />
                </div>
              </div>
              <div className="admin-order-update-form__field">
                <label htmlFor="order-notas">Notas</label>
                <textarea
                  id="order-notas"
                  rows={3}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Notas internas sobre el pedido"
                />
              </div>
              {error && (
                <div className="admin-products__alert admin-products__alert--error" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="admin-products__alert" role="status">
                  {success}
                </div>
              )}
              <div className="admin-order-update-form__actions">
                <button
                  type="submit"
                  className="admin-products__action-button admin-products__action-button--primary"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>

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
