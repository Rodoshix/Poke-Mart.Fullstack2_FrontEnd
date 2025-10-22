// usado por Reviews.jsx
// src/components/reviews/ReviewsSummary.jsx
import { starText } from "./stars";

export default function ReviewsSummary({ count, avg, dist }) {
  return (
    <div className="reviews-summary card p-3 h-100">
      <div className="d-flex align-items-center gap-3">
        <div>
          <div className="reviews-summary__avg display-5 fw-bold">
            {count ? avg.toFixed(1) : "—"}
          </div>
          <div className="reviews-summary__stars" aria-label="Calificación promedio">
            {count ? starText(avg) : "☆☆☆☆☆"}
          </div>
          <div className="text-secondary small">
            {count} calificación{count === 1 ? "" : "es"}
          </div>
        </div>
      </div>

      <hr />

      <div className="reviews-bars">
        {[5,4,3,2,1].map(st => {
          const pct = count ? Math.round((dist[st] || 0) * 100 / count) : 0;
          return (
            <div className="bar" key={st}>
              <span className="small" style={{ width: "2rem" }}>{st}★</span>
              <div className="bar__track"><div className="bar__fill" style={{ width: `${pct}%` }} /></div>
              <span className="small text-secondary" style={{ width: "3rem", textAlign:"right" }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
