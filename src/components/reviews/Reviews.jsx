// src/components/reviews/Reviews.jsx
import { useReviewsData } from "@/hooks/useReviewsData";
import ReviewsSummary from "./ReviewsSummary";
import ReviewsFilterMenu from "./ReviewsFilterMenu";
import ReviewsList from "./ReviewsList";
import ReviewForm from "./ReviewForm.jsx";
import "@/assets/styles/reviews.css";

export function Reviews({ reviews = [], productId, reviewsDict = {}, onSubmit, canReview }) {
  const { count, avg, dist, filter, setFilter, filtered, showMissingBanner } = useReviewsData({ reviews, productId, reviewsDict });

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
          {showMissingBanner && (
            <div className="alert alert-warning mb-3" role="alert">
              No hay reseñas en reviews.json para este producto ({productId}).
            </div>
          )}
          <ReviewsList items={filtered} />
        </div>
      </div>
    </section>
  );
}
