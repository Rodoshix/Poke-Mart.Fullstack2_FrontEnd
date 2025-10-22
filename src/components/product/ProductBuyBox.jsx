// usado por ProductDetailPage.jsx
// src/components/product/ProductBuyBox.jsx
import { money } from "@/utils/money";

const MAX_QTY = 99;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function ProductBuyBox({
  name,
  price,
  description,
  available = 0,
  qty,
  setQty,
  onAdd,
}) {
  return (
    <aside className="product__info col-12 col-lg-5">
      <h1 className="h3 mb-2">{name}</h1>
      <div className="h4 text-primary mb-3">{money(price)}</div>

      <p className="product__desc text-secondary">{description}</p>

      <div className="product__buy d-flex align-items-center gap-2 my-3">
        <label htmlFor="qty" className="form-label m-0">Cantidad</label>
        <input
          id="qty"
          type="number"
          min={available > 0 ? 1 : 0}
          max={Math.min(available, MAX_QTY)}
          value={available > 0 ? qty : 0}
          disabled={available <= 0}
          onChange={(e) => {
            const raw = parseInt(e.target.value || "0", 10);
            const next = clamp(raw, available > 0 ? 1 : 0, Math.min(available, MAX_QTY));
            setQty(next);
          }}
          className="form-control"
          style={{ maxWidth: "100px" }}
        />
        <button
          className={`btn flex-grow-1 ${available > 0 ? "btn-primary" : "btn-outline-secondary"}`}
          disabled={available <= 0}
          onClick={onAdd}
        >
          {available > 0 ? "Añadir al carrito" : "Sin stock"}
        </button>
      </div>

      <div className="small text-muted">Stock: {available}</div>
    </aside>
  );
}
