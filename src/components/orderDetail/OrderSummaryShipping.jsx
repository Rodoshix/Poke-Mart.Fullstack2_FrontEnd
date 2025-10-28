import { formatDateTime } from "@/components/orderDetail/orderSummaryUtils.js";

const OrderSummaryShipping = ({ shipping }) => (
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
);

export default OrderSummaryShipping;

