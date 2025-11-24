import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/catalogApi.js";
import { getAllProducts } from "@/services/productService.js";

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
          setProducts(getAllProducts());
          setError("Usando datos locales por falla de red");
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
