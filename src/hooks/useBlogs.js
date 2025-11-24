import { useCallback, useEffect, useState } from "react";
import { fetchBlogs } from "@/services/blogApi.js";

const MIN_DELAY = 3000;

export function useBlogs(params = {}) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { categoria, q } = params || {};

  const load = useCallback(async () => {
    const start = Date.now();
    setLoading(true);
    setError("");
    try {
      const data = await fetchBlogs({ categoria, q });
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los blogs.");
      setBlogs([]);
    } finally {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_DELAY - elapsed);
      setTimeout(() => setLoading(false), wait);
    }
  }, [categoria, q]);

  useEffect(() => {
    load();
  }, [load]);

  return { blogs, loading, error, reload: load };
}
