// src/hooks/useAuthSession.js
import { useEffect, useState } from "react";
import { getAuth, getProfile } from "@/components/auth/session";

export default function useAuthSession() {
  const [state, setState] = useState(() => ({
    session: getAuth(),
    profile: getProfile(),
  }));

  useEffect(() => {
    const handler = () => {
      setState({ session: getAuth(), profile: getProfile() });
    };
    window.addEventListener("pm:authchange", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("pm:authchange", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return state; // { session, profile }
}
