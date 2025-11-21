import { useEffect, useState } from "react";
import { fetchAdminOrders } from "@/services/orderApi.js";

const useOrdersData = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchAdminOrders();
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setOrders([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return orders;
};

export default useOrdersData;
