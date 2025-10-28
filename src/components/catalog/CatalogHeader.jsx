// usado en CatalogPage.jsx
// src/components/catalog/CatalogHeader.jsx
export default function CatalogHeader({
  q,
  cat,
  categorias = [],
  onChangeQ,
  onChangeCat,
  onClear,
}) {
  const qId = "catalogQ";
  const catId = "catalogCat";

  return (
    <section className="products-header container pt-3 pb-3">
      <h1 className="text-center display-5 mb-4">PRODUCTOS</h1>

      <form
        className="products-filters row g-3 justify-content-center"
        role="search"
        aria-label="Filtros del catálogo"
      >
        {/* Buscar */}
        <div className="col-12 col-md-5">
          <label className="form-label products-filters__label" htmlFor={qId}>
            Buscar
          </label>
          <input
            id={qId}
            type="search"
            className="form-control"
            placeholder="Nombre o categoría"
            value={q}
            onChange={(e) => onChangeQ?.(e.target.value)}
          />
        </div>

        {/* Categoría */}
        <div className="col-6 col-md-3">
          <label className="form-label products-filters__label" htmlFor={catId}>
            Categoría
          </label>
          <select
            id={catId}
            className="form-select"
            value={cat}
            onChange={(e) => onChangeCat?.(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Limpiar (sin label fantasma) */}
        <div className="col-6 col-md-2 d-grid align-self-end">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => onClear?.()}
            aria-label="Limpiar filtros de búsqueda y categoría"
          >
            Limpiar
          </button>
        </div>
      </form>
    </section>
  );
}
