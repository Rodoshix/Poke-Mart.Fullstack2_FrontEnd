import { useEffect, useState } from "react";
import { fetchAdminProducts } from "@/services/adminProductApi.js";

export default function useAdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchAdminProducts();
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setProducts([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}
