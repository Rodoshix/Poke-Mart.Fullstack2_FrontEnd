import { useEffect, useState } from "react";
import { fetchBlogBySlug } from "@/services/blogApi.js";

const MIN_DELAY = 3000;

export function useBlogDetail(slug) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    const start = Date.now();
    setLoading(true);
    setError("");
    setNotFound(false);

    const load = async () => {
      try {
        const data = await fetchBlogBySlug(slug);
        if (!active) return;
        setBlog(data);
        setNotFound(false);
      } catch (err) {
        if (!active) return;
        const msg = (err?.message || "").toLowerCase();
        const is404 = msg.includes("no encontrado") || msg.includes("404") || msg.includes("not found");
        if (is404) {
          setNotFound(true);
          setBlog(null);
        } else {
          setError(err?.message || "No se pudo cargar el blog.");
        }
      } finally {
        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_DELAY - elapsed);
        setTimeout(() => {
          if (active) setLoading(false);
        }, wait);
      }
    };

    if (slug) load(); else setLoading(false);

    return () => {
      active = false;
    };
  }, [slug]);

  return { blog, loading, error, notFound };
}
