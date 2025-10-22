// usado en CatalogPage.jsx
// src/components/catalog/CatalogHeader.jsx
export default function CatalogHeader({ q, cat, categorias, onChangeQ, onChangeCat, onClear }) {
  return (
    <section className="products-header container pt-3 pb-3">
      <h1 className="text-center display-5 mb-4">PRODUCTOS</h1>

      <form className="products-filters row g-3 justify-content-center">
        <div className="col-12 col-md-5">
          <label className="form-label products-filters__label" htmlFor="q">Buscar</label>
          <input
            id="q"
            type="search"
            className="form-control"
            placeholder="Nombre o categoría"
            value={q}
            onChange={(e) => onChangeQ(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3">
          <label className="form-label products-filters__label" htmlFor="cat">Categoría</label>
          <select
            id="cat"
            className="form-select"
            value={cat}
            onChange={(e) => onChangeCat(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-2 d-grid">
          <label className="form-label invisible">.</label>
          <button type="button" className="btn btn-outline-secondary" onClick={onClear}>
            Limpiar
          </button>
        </div>

        <div> </div> {/* espaciador */}
      </form>
    </section>
  );
}
