// usado por Reviews.jsx
// src/hooks/useReviewsData.js
import { useMemo, useState } from "react";

export function useReviewsData({ reviews = [], productId, reviewsDict = {} }) {
  const data = Array.isArray(reviews) ? reviews : [];

  const count = data.length;
  const avg = count ? data.reduce((a, r) => a + (r.rating || 0), 0) / count : 0;

  const dist = useMemo(() => {
    const d = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach((r) => {
      d[r.rating] = (d[r.rating] || 0) + 1;
    });
    return d;
  }, [data]);

  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => {
    const base = filter === "all" ? data : data.filter((r) => String(r.rating) === filter);
    return base.slice(0, 6);
  }, [data, filter]);

  const showMissingBanner = Boolean(productId) && !reviewsDict[productId];

  return { data, count, avg, dist, filter, setFilter, filtered, showMissingBanner };
}
