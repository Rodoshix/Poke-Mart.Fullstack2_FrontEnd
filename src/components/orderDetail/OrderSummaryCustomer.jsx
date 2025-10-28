const OrderSummaryCustomer = ({ customer, customerEmail, customerPhone }) => (
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
);

export default OrderSummaryCustomer;

