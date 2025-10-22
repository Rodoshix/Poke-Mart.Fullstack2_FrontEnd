// usado por Reviews.jsx
// src/components/reviews/ReviewsList.jsx
import ReviewItem from "./ReviewItem";

export default function ReviewsList({ items = [] }) {
  return (
    <div className="reviews-list">
      {items.length ? (
        items.map((r) => <ReviewItem key={r.id} r={r} />)
      ) : (
        <div className="text-secondary small">No hay opiniones para este filtro.</div>
      )}
    </div>
  );
}
