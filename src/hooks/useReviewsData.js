// usado por Reviews.jsx
// src/hooks/useReviewsData.js
import { useMemo, useState } from "react";

export function useReviewsData({ reviews = [], productId, reviewsDict }) {
  const autoFromDict = useMemo(() => {
    if (!productId || !reviewsDict || typeof reviewsDict !== "object") return [];
    const k0 = String(productId).trim();
    const k1 = k0.replace(/^0+/, "");
    const n  = Number(k0);
    const k2 = Number.isFinite(n) ? String(n) : null;
    const candidates = [k0, k1, k2].filter(Boolean);
    for (const k of candidates) {
      const val = reviewsDict[k];
      if (Array.isArray(val)) return val;
    }
    return [];
  }, [productId, reviewsDict]);

  const data = (reviews && reviews.length) ? reviews : autoFromDict;

  const count = data.length;
  const avg = count ? data.reduce((a, r) => a + (r.rating || 0), 0) / count : 0;

  const dist = useMemo(() => {
    const d = { 1:0,2:0,3:0,4:0,5:0 };
    data.forEach(r => { d[r.rating] = (d[r.rating] || 0) + 1; });
    return d;
  }, [data]);

  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => {
    const base = filter === "all" ? data : data.filter(r => String(r.rating) === filter);
    return base.slice(0, 6);
  }, [data, filter]);

  const showMissingBanner = !reviews?.length && productId && reviewsDict && typeof reviewsDict === "object" && !count;

  return { data, count, avg, dist, filter, setFilter, filtered, showMissingBanner };
}
