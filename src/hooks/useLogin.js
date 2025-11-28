// usado por LoginPage.jsx
// src/hooks/useLogin.js
import { useEffect, useState } from "react";
import { setAuth } from "@/components/auth/session";
import { login as loginApi } from "@/services/authService.js";

export function useLogin({ navigate, params }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  // forgot password (deshabilitado)
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // 'email' | 'code'
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotErr, setForgotErr] = useState("");
  const [demoCode, setDemoCode] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("pm_username");
    if (saved) {
      setUsername(saved);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Ingresa usuario o correo y contraseña.");
      return;
    }

    try {
      const payload = await loginApi({ identifier: username.trim(), password });
      const { token, refreshToken, expiresAt, profile } = payload || {};
      if (!token || !profile) {
        throw new Error("No se pudo iniciar sesión. Respuesta inválida.");
      }

      const normalizedProfile = {
        ...profile,
        role: (profile.role || "").toLowerCase(),
      };

      if (remember) localStorage.setItem("pm_username", username.trim());
      else localStorage.removeItem("pm_username");

      setAuth({
        token,
        refreshToken,
        expiresAt: expiresAt ?? Date.now() + 60 * 60 * 1000,
        profile: normalizedProfile,
      });

      const redirect = params?.get?.("redirect");
      if (redirect === "carrito") {
        navigate("/carrito", { replace: true });
        return;
      }

      const role = normalizedProfile.role || "";
      const isAdminOrSeller = role === "admin" || role === "vendedor";
      navigate(isAdminOrSeller ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión. Intenta nuevamente.");
    }
  };

  const genCode = (len = 6) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");

  const openForgot = () => {
    setForgotOpen(true);
    setForgotStep("email");
    setForgotEmail("");
    setForgotErr("Recuperación no está habilitada en esta versión.");
    setDemoCode("");
  };
  const closeForgot = () => setForgotOpen(false);

  const handleForgotEmail = (e) => {
    e.preventDefault();
    setForgotErr("Recuperación de contraseña no está disponible.");
  };

  const confirmCode = (value) => {
    setForgotErr("Recuperación de contraseña no está disponible.");
  };

  return {
    // login
    username, setUsername,
    password, setPassword,
    remember, setRemember,
    error, setError,
    handleSubmit,
    // forgot
    forgotOpen, openForgot, closeForgot,
    forgotStep, forgotEmail, setForgotEmail,
    forgotErr, demoCode, handleForgotEmail, confirmCode,
  };
}
