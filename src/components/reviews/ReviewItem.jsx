// usado por ReviewsList.jsx
// src/components/reviews/ReviewItem.jsx
import { starText } from "./stars";

export default function ReviewItem({ r }) {
  return (
    <article className="review">
      <div className="review__stars">{starText(r.rating)}</div>
      <div className="review__meta">
        {(r.author || "Comprador verificado")} ·{" "}
        {r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
          : "Reciente"}
      </div>
      <p className="mb-2">{r.comment}</p>
    </article>
  );
}
