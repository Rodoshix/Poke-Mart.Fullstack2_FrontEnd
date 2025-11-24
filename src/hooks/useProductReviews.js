import { useEffect, useState } from "react";
import { fetchProductReviews, createProductReview } from "@/services/reviewApi.js";

export function useProductReviews(productId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProductReviews(productId);
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || "No se pudieron cargar las rese\u00f1as.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const addReview = async (payload) => {
    if (!productId) throw new Error("Producto no valido");
    const created = await createProductReview(productId, payload);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  return { items, loading, error, addReview };
}
