import OrderBadge from "@/components/orders/OrderBadge.jsx";

const formatCurrency = (amount = 0, currency = "CLP") =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

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

const OrderSummary = ({ order }) => {
  if (!order) {
    return null;
  }

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
        <article className="admin-order-summary__card">
          <h3 className="admin-order-summary__card-title">Cliente</h3>
          <dl className="admin-order-summary__list">
            <div>
              <dt>Nombre</dt>
              <dd>{customer}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{customerEmail || "No registrado"}</dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>{customerPhone || "No registrado"}</dd>
            </div>
          </dl>
        </article>

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

        <article className="admin-order-summary__card">
          <h3 className="admin-order-summary__card-title">Despacho</h3>
          <dl className="admin-order-summary__list">
            <div>
              <dt>Método</dt>
              <dd>{shipping?.method || "Sin envío"}</dd>
            </div>
            <div>
              <dt>Transportista</dt>
              <dd>{shipping?.carrier || "No asignado"}</dd>
            </div>
            <div>
              <dt>Seguimiento</dt>
              <dd>{shipping?.trackingNumber || "No disponible"}</dd>
            </div>
            <div>
              <dt>Entrega estimada</dt>
              <dd>{shipping?.estimatedDelivery ? formatDateTime(shipping.estimatedDelivery) : "Por confirmar"}</dd>
            </div>
          </dl>
          {shipping?.address && (
            <div className="admin-order-summary__address">
              <span className="admin-order-summary__address-label">Dirección de envío</span>
              <address>
                {shipping.address.street && <span>{shipping.address.street}</span>}
                {shipping.address.city && <span>{shipping.address.city}</span>}
                {shipping.address.region && <span>{shipping.address.region}</span>}
                {shipping.address.reference && <span>{shipping.address.reference}</span>}
                {shipping.address.zipCode && <span>CP {shipping.address.zipCode}</span>}
                <span>{shipping.address.country ?? "Chile"}</span>
              </address>
            </div>
          )}
        </article>

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
              <span>{formatCurrency(summary?.total ?? order.total ?? 0, currency)}</span>
            </li>
            <li className="admin-order-summary__totals-note">
              <span>IVA incluido (19%)</span>
              <span>{formatCurrency(summary?.taxes ?? 0, currency)}</span>
            </li>
          </ul>
        </article>
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
