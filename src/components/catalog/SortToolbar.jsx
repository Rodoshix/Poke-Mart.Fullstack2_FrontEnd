// usado por CategoriaPage.jsx
// src/components/catalog/SortToolbar.jsx
export default function SortToolbar({ sort = "recomendados", onChange }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <label htmlFor="sortSel" className="text-muted">Ordenar por</label>
      <div className="dropdown">
        <button
          id="sortSel"
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <strong>
            {
              {
                "recomendados": "Recomendados",
                "precio-asc": "Precio: bajo a alto",
                "precio-desc": "Precio: alto a bajo",
                "nombre-asc": "Nombre A–Z",
                "nombre-desc": "Nombre Z–A",
              }[sort] || "Recomendados"
            }
          </strong>
        </button>
        <ul className="dropdown-menu">
          <li><button className="dropdown-item" onClick={() => onChange?.("recomendados")}>Recomendados</button></li>
          <li><button className="dropdown-item" onClick={() => onChange?.("precio-asc")}>Precio: bajo a alto</button></li>
          <li><button className="dropdown-item" onClick={() => onChange?.("precio-desc")}>Precio: alto a bajo</button></li>
          <li><button className="dropdown-item" onClick={() => onChange?.("nombre-asc")}>Nombre A–Z</button></li>
          <li><button className="dropdown-item" onClick={() => onChange?.("nombre-desc")}>Nombre Z–A</button></li>
        </ul>
      </div>
    </div>
  );
}
