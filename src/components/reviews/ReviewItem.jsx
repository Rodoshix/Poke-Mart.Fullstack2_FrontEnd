// usado por ReviewsList.jsx
// src/components/reviews/ReviewItem.jsx
import { starText } from "./stars";

export default function ReviewItem({ r }) {
  return (
    <article className="review">
      <div className="review__stars">{starText(r.rating)}</div>
      <div className="review__meta">
        {(r.user || "Comprador verificado")} · {new Date(r.fecha).toLocaleDateString("es-CL", { day:"2-digit", month:"short", year:"numeric" })}
      </div>
      <p className="mb-2">{r.texto}</p>
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-secondary py-0 px-2"
          onClick={(e) => {
            const next = Number(e.currentTarget.nextSibling.textContent || 0) + 1;
            e.currentTarget.nextSibling.textContent = String(next);
            e.currentTarget.disabled = true;
          }}
        >
          Es útil
        </button>
        <span className="review__help">{r.util || 0}</span>
      </div>
    </article>
  );
}
