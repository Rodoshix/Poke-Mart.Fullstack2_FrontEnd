import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/catalogApi.js";
import { getAllProducts } from "@/services/productService.js";

const useProductsData = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchProducts();
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (_) {
        if (!cancelled) setProducts(getAllProducts());
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
