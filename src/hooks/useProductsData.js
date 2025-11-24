import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/catalogApi.js";

const useProductsData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts();
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (_) {
        if (!cancelled) {
          setProducts([]);
          setError("No se pudieron cargar los productos. Intenta nuevamente en un momento.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return Object.assign(products, { loading, error });
};

export default useProductsData;
