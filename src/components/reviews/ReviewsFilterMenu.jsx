// usado por Reviews.jsx
// src/components/reviews/ReviewsFilterMenu.jsx
export default function ReviewsFilterMenu({ value, onChange }) {
  return (
    <div className="dropstart">
      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
        Calificación
      </button>
      <ul className="dropdown-menu">
        <li><button className="dropdown-item" onClick={() => onChange("all")}>Todas</button></li>
        {[5,4,3,2,1].map(n => (
          <li key={n}><button className="dropdown-item" onClick={() => onChange(String(n))}>{n} estrellas</button></li>
        ))}
      </ul>
    </div>
  );
}
