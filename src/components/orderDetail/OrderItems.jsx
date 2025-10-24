const formatCurrency = (amount = 0, currency = "CLP") =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const OrderItems = ({ items = [], currency = "CLP" }) => (
  <section className="admin-order-items">
    <header className="admin-order-items__header">
      <h3>Productos de la orden</h3>
      <span>{items.length} artículos</span>
    </header>

    <div className="admin-order-items__table-wrapper">
      <table className="admin-order-items__table">
        <thead>
          <tr>
            <th scope="col">SKU</th>
            <th scope="col">Producto</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Precio unitario</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="admin-order-items__empty">
                Esta orden no tiene productos registrados.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={`${item.sku}-${item.name}`}>
                <td className="admin-order-items__cell--mono">{item.sku || "—"}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.unitPrice, currency)}</td>
                <td>{formatCurrency(item.unitPrice * item.quantity, currency)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default OrderItems;
