import { useEffect, useState } from "react";
import { fetchAdminUsers } from "@/services/adminUserApi.js";

const useUsersData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAdminUsers();
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) {
          setUsers([]);
          setError("No se pudieron cargar los usuarios");
        }
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return Object.assign(users, { loading, error });
};

export default useUsersData;
