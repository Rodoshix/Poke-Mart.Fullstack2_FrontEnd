// usado por OfferCard.jsx
// src/components/offers/OffersToolbar.jsx
export default function OffersToolbar({ sort, onChange }) {
  return (
    <header className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
      <h1 className="h3 m-0">Ofertas</h1>
      <div className="d-flex align-items-center gap-2">
        <label className="form-label m-0 me-1" htmlFor="sort">Ordenar por</label>
        <select
          id="sort"
          className="form-select form-select-sm"
          style={{ width: 220 }}
          value={sort}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="best">Mayor descuento</option>
          <option value="priceAsc">Precio: menor a mayor</option>
          <option value="priceDesc">Precio: mayor a menor</option>
          <option value="ending">Terminan antes</option>
        </select>
      </div>
    </header>
  );
}
