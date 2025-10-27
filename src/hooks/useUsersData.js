import { useEffect, useState } from "react";
import {
  getAllUsers,
  subscribeToUserChanges,
  REGISTERED_USER_STORAGE_KEY,
  USER_STORAGE_KEY,
} from "@/services/userService.js";

const useUsersData = () => {
  const [users, setUsers] = useState(() => getAllUsers());

  useEffect(() => {
    const refresh = () => setUsers(getAllUsers());
    const unsubscribe = subscribeToUserChanges(refresh);

    if (typeof window === "undefined") {
      return unsubscribe;
    }

    const handleStorage = (event) => {
      if (
        event.key === null ||
        event.key === USER_STORAGE_KEY ||
        event.key === REGISTERED_USER_STORAGE_KEY
      ) {
        refresh();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return users;
};

export default useUsersData;
