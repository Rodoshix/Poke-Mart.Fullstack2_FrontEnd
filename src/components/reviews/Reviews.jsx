// src/components/reviews/Reviews.jsx
import { useReviewsData } from "@/hooks/useReviewsData";
import ReviewsSummary from "./ReviewsSummary";
import ReviewsFilterMenu from "./ReviewsFilterMenu";
import ReviewsList from "./ReviewsList";
import ReviewForm from "./ReviewForm.jsx";
import "@/assets/styles/reviews.css";

export function Reviews({ reviews = [], onSubmit, canReview }) {
  const { count, avg, dist, filter, setFilter, filtered } = useReviewsData({ reviews });

  return (
    <section className="reviews-section">
      <div className="reviews-grid">
        <div className="reviews-card reviews-card--left">
          <ReviewsSummary count={count} avg={avg} dist={dist} />
          {canReview ? (
            <ReviewForm onSubmit={onSubmit} disabled={!canReview} />
          ) : (
            <div className="alert alert-info mt-3" role="status">
              Inicia sesión para dejar tu reseña.
            </div>
          )}
        </div>

        <div className="reviews-card reviews-card--right">
          <div className="reviews-card__header">
            <div className="reviews-card__title">Opiniones recientes</div>
            <ReviewsFilterMenu value={filter} onChange={setFilter} />
          </div>
          <ReviewsList items={filtered} />
        </div>
      </div>
    </section>
  );
}
