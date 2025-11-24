import { useEffect, useState } from "react";
import { fetchAdminOrders } from "@/services/orderApi.js";

const useOrdersData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAdminOrders();
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) {
          setOrders([]);
          setError("No se pudieron cargar las ordenes");
        }
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return Object.assign(orders, { loading, error });
};

export default useOrdersData;
