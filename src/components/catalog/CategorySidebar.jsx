// usado por CategoriaPage.jsx
// src/components/catalog/CategorySidebar.jsx
export default function CategorySidebar({ categorias = [], value = "", onChange }) {
  const MAX_VISIBLE = 6;
  const visible = categorias.slice(0, MAX_VISIBLE);
  const hidden = categorias.slice(MAX_VISIBLE);

  return (
    <div className="category-sidebar">
      <div className="mb-2 text-muted small">Categoría</div>

      <div className="list-group list-group-flush">
        {categorias.length === 0 ? (
          <div className="text-muted small">No hay categorías</div>
        ) : (
          <>
            {visible.map((c) => (
              <label key={c} className="d-flex align-items-center gap-2 py-1">
                <input
                  type="radio"
                  className="form-check-input m-0"
                  name="cat"
                  value={c}
                  checked={value === c}
                  onChange={() => onChange?.(c)}
                />
                <span>{c}</span>
              </label>
            ))}

            {/* ver más */}
            {hidden.length > 0 && (
              <details>
                <summary className="mt-2 ms-1">+ Ver Más</summary>
                <div className="pt-2">
                  {hidden.map((c) => (
                    <label key={c} className="d-flex align-items-center gap-2 py-1">
                      <input
                        type="radio"
                        className="form-check-input m-0"
                        name="cat"
                        value={c}
                        checked={value === c}
                        onChange={() => onChange?.(c)}
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </details>
            )}

            {/* limpiar */}
            <div className="mt-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onChange?.("")}
              >
                Limpiar categoría
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
