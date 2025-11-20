import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/catalogApi.js";
import {
  getAllProducts,
} from "@/services/productService.js";

const useProductsData = () => {
  const [products, setProducts] = useState(() => getAllProducts());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchProducts();
        if (!cancelled) setProducts(data);
      } catch (_) {
        // si falla, se mantiene el fallback local
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return products;
};

export default useProductsData;
