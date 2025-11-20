import { useEffect, useState } from "react";
import { fetchAdminUsers } from "@/services/adminUserApi.js";

const useUsersData = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchAdminUsers();
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setUsers([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return users;
};

export default useUsersData;
