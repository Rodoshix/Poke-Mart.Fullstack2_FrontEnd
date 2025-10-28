import { useEffect, useState } from "react";
import {
  getAllOrders,
  subscribeToOrderChanges,
  ORDER_STORAGE_KEY,
} from "@/services/orderService.js";

const useOrdersData = () => {
  const [orders, setOrders] = useState(() => getAllOrders());

  useEffect(() => {
    const refresh = () => setOrders(getAllOrders());
    const unsubscribe = subscribeToOrderChanges(refresh);

    if (typeof window !== "undefined") {
      const handleStorage = (event) => {
        if (event.key === null || event.key === ORDER_STORAGE_KEY) {
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

  return orders;
};

export default useOrdersData;
