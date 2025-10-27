import { useEffect, useState } from "react";
import {
  getAllProducts,
  subscribeToProductChanges,
  PRODUCT_STORAGE_KEY,
} from "@/services/productService.js";

const useProductsData = () => {
  const [products, setProducts] = useState(() => getAllProducts());

  useEffect(() => {
    const refresh = () => setProducts(getAllProducts());
    const unsubscribe = subscribeToProductChanges(refresh);

    if (typeof window !== "undefined") {
      const handleStorage = (event) => {
        if (event.key === null || event.key === PRODUCT_STORAGE_KEY) {
          refresh();
        }
      };
      window.addEventListener("storage", handleStorage);
      return () => {
        unsubscribe();
        window.removeEventListener("storage", handleStorage);
      };
    }

    return unsubscribe;
  }, []);

  return products;
};

export default useProductsData;
