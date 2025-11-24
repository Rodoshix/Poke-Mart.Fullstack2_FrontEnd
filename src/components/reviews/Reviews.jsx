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
    <section className="reviews mt-5">
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <ReviewsSummary count={count} avg={avg} dist={dist} />
          {canReview && <ReviewForm onSubmit={onSubmit} disabled={!canReview} />}
          {!canReview && (
            <div className="alert alert-info mt-3" role="status">
              Inicia sesión para dejar tu reseña.
            </div>
          )}
        </div>

        <div className="col-12 col-lg-8">
          <div className="card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold">Opiniones recientes</div>
              <ReviewsFilterMenu value={filter} onChange={setFilter} />
            </div>
            <ReviewsList items={filtered} />
          </div>
        </div>
      </div>
    </section>
  );
}
