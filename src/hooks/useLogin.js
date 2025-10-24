// usado por LoginPage.jsx
// src/hooks/useLogin.js
import { useEffect, useMemo, useState } from "react";
import usersJson from "@/data/users.json";
import { setAuth } from "@/components/auth/session";

export function useLogin({ navigate, params }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  // forgot password
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // 'email' | 'code'
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotErr, setForgotErr] = useState("");
  const [demoCode, setDemoCode] = useState("");

  const allUsers = useMemo(() => {
    const base = Array.isArray(usersJson?.users) ? usersJson.users : [];
    try {
      const extras = JSON.parse(localStorage.getItem("pm_registeredUsers") || "[]");
      return Array.isArray(extras) ? base.concat(extras) : base;
    } catch {
      return base;
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("pm_username");
    if (saved) {
      setUsername(saved);
      setRemember(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Ingresa usuario y contraseña.");
      return;
    }

    const found = allUsers.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (!found) {
      setError("Credenciales inválidas. Intenta nuevamente.");
      return;
    }

    if (remember) localStorage.setItem("pm_username", username.trim());
    else localStorage.removeItem("pm_username");

    const token =
      (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    const profile = {
      id: found.id,
      username: found.username,
      role: found.role,
      nombre: found.nombre,
      apellido: found.apellido,
      email: found.email,
    };

    setAuth({ token, profile });

    const redirect = params?.get?.("redirect");
    if (redirect === "carrito") {
      navigate("/carrito", { replace: true });
      return;
    }

    const isAdmin = (found.role || "").toLowerCase() === "admin";
    navigate(isAdmin ? "/admin" : "/", { replace: true });
  };

  const genCode = (len = 6) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");

  const openForgot = () => {
    setForgotOpen(true);
    setForgotStep("email");
    setForgotEmail("");
    setForgotErr("");
    setDemoCode("");
  };
  const closeForgot = () => setForgotOpen(false);

  const handleForgotEmail = (e) => {
    e.preventDefault();
    setForgotErr("");

    const email = (forgotEmail || "").trim().toLowerCase();
    if (!email) return setForgotErr("Ingresa tu correo.");

    const found = allUsers.find((u) => (u.email || "").toLowerCase() === email);
    if (!found) return setForgotErr("No encontramos una cuenta con ese correo.");

    const code = genCode(6);
    setDemoCode(code);

    const payload = {
      userId: found.id,
      email: found.email,
      code,
      exp: Date.now() + 5 * 60 * 1000,
    };
    sessionStorage.setItem("pm_reset", JSON.stringify(payload));
    setForgotStep("code");
  };

  const confirmCode = (value) => {
    setForgotErr("");
    const val = (value || "").trim();
    if (!/^\d{6}$/.test(val)) return setForgotErr("Ingresa los 6 dígitos del código.");

    const raw = sessionStorage.getItem("pm_reset");
    if (!raw) return setForgotErr("Solicita un nuevo código.");

    let data = null;
    try { data = JSON.parse(raw); } catch {}

    if (!data?.code || !data?.email) return setForgotErr("Código no válido.");
    if (Date.now() > data.exp) return setForgotErr("El código expiró. Solicita uno nuevo.");
    if (String(data.code) !== val) return setForgotErr("Código incorrecto.");

    const user = allUsers.find(
      (u) => u.id === data.userId || (u.email || "").toLowerCase() === (data.email || "").toLowerCase()
    );
    if (!user) return setForgotErr("Usuario no encontrado.");

    sessionStorage.removeItem("pm_reset");

    const token =
      (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    const profile = {
      id: user.id,
      username: user.username,
      role: user.role,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
    };

    setAuth({ token, profile });
    closeForgot();

    const isAdmin = (user.role || "").toLowerCase() === "admin";
    navigate(isAdmin ? "/admin" : "/", { replace: true });
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
