import { useEffect, useState } from "react";
import { fetchAdminUsers } from "@/services/adminUserApi.js";
import { getAllUsers } from "@/services/userService.js";

const useUsersData = () => {
  const [users, setUsers] = useState(() => getAllUsers());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchAdminUsers();
        if (!cancelled && Array.isArray(data)) {
          setUsers(data);
        }
      } catch {
        // fallback se queda con los datos locales/mock
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
