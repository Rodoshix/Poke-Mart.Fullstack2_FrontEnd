// usado por ReviewsList.jsx
// src/components/reviews/ReviewItem.jsx
import { useState } from "react";
import { starText } from "./stars";

export default function ReviewItem({ r }) {
  const [helpful, setHelpful] = useState(Number(r.util ?? r.helpful ?? 0));
  const [disabled, setDisabled] = useState(false);

  const author = r.user || r.author || "Comprador verificado";
  const dateLabel = r.fecha || r.createdAt;
  const formattedDate = dateLabel
    ? new Date(dateLabel).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
    : "Reciente";

  const handleHelpful = () => {
    if (disabled) return;
    setHelpful((x) => x + 1);
    setDisabled(true);
  };

  return (
    <article className="review">
      <div className="review__stars">{starText(r.rating)}</div>
      <div className="review__meta">{`${author} · ${formattedDate}`}</div>
      <p className="mb-2">{r.texto || r.comment}</p>
      <button
        type="button"
        className="btn btn-sm btn-outline-primary"
        onClick={handleHelpful}
        disabled={disabled}
        aria-label="Es útil"
      >
        Es útil
      </button>{" "}
      <span>{helpful}</span>
    </article>
  );
}
