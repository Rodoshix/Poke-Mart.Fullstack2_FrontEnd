// src/components/reviews/Reviews.jsx
import { useReviewsData } from "@/hooks/useReviewsData";
import ReviewsSummary from "./ReviewsSummary";
import ReviewsFilterMenu from "./ReviewsFilterMenu";
import ReviewsList from "./ReviewsList";
import "@/assets/styles/reviews.css";

export function Reviews({ reviews = [], productId, reviewsDict }) {
  const { count, avg, dist, filter, setFilter, filtered, showMissingBanner } =
    useReviewsData({ reviews, productId, reviewsDict });

  return (
    <section className="reviews mt-5">
      {showMissingBanner && (
        <div className="alert alert-warning mb-3" role="alert">
          No hay reseñas en <code>reviews.json</code> para el id <strong>{String(productId)}</strong>.
          Asegúrate de que exista esa clave (por ejemplo <code>"{String(productId)}"</code>) con un array de reseñas.
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <ReviewsSummary count={count} avg={avg} dist={dist} />
        </div>

        <div className="col-12 col-lg-8">
          <div className="card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold">Opiniones destacadas</div>
              <ReviewsFilterMenu value={filter} onChange={setFilter} />
            </div>
            <ReviewsList items={filtered} />
          </div>
        </div>
      </div>
    </section>
  );
}
