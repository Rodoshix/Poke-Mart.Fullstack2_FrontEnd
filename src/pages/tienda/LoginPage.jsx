// src/pages/tienda/LoginPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import usersJson from "@/data/users.json";

import "@/assets/styles/login.css";
import bgLogin from "@/assets/img/login.gif";
import logoPoke from "@/assets/img/poke-mark-logo.png";

import { setAuth } from "@/components/auth/session";

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const [forgotStep, setForgotStep] = useState("email");
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

  useEffect(() => {
    document.body.classList.add("page--login");
    document.body.style.setProperty("--login-bg", `url(${bgLogin})`);
    return () => {
      document.body.classList.remove("page--login");
      document.body.style.removeProperty("--login-bg");
    };
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

    const redirect = params.get("redirect");
    if (redirect === "carrito") {
      navigate("/carrito", { replace: true });
      return;
    }
    navigate(found.role === "admin" ? "/" : "/catalogo", { replace: true });
  };

  const genCode = (len = 6) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");

  const openForgot = () => {
    setForgotStep("email");
    setForgotEmail("");
    setForgotErr("");
    setDemoCode("");
    const dlg = document.getElementById("forgotDialog");
    if (dlg && typeof dlg.showModal === "function") dlg.showModal();
  };

  const closeForgot = () => {
    const dlg = document.getElementById("forgotDialog");
    if (dlg && typeof dlg.close === "function") dlg.close();
  };

  const handleForgotEmail = (e) => {
    e.preventDefault();
    setForgotErr("");

    const email = (forgotEmail || "").trim().toLowerCase();
    if (!email) return setForgotErr("Ingresa tu correo.");

    const found = allUsers.find(
      (u) => (u.email || "").toLowerCase() === email
    );
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
    try {
      data = JSON.parse(raw);
    } catch {}

    if (!data?.code || !data?.email) return setForgotErr("Código no válido.");
    if (Date.now() > data.exp) return setForgotErr("El código expiró. Solicita uno nuevo.");
    if (String(data.code) !== val) return setForgotErr("Código incorrecto.");

    const user = allUsers.find(
      (u) =>
        u.id === data.userId ||
        (u.email || "").toLowerCase() === (data.email || "").toLowerCase()
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
    navigate(user.role === "admin" ? "/" : "/catalogo", { replace: true });
  };

  const LOGO = logoPoke;

  return (
    <main className="login d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <section
        className="login__wrapper p-4"
        style={{ width: "min(92vw, 420px)", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,.25)", zIndex: 1 }}
        aria-labelledby="loginTitle"
      >
        <header className="login__header text-center mb-3">
          <div className="logo-container">
            <img className="login__logo" src={LOGO} alt="Logo Poké Mart" width="48" height="48" />
            <h1 className="login__empresa m-0">Poké Mart</h1>
          </div>
          <h2 id="loginTitle" className="login__title mt-2">Login</h2>
        </header>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <div className="login__field">
            <input
              id="username"
              type="text"
              className="login__input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <span className="login__icon bi bi-person" aria-hidden="true" />
          </div>

        <div className="login__field">
            <input
              id="password"
              type="password"
              className="login__input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <span className="login__icon bi bi-lock" aria-hidden="true" />
          </div>

          <div className="login__options">
            <label className="login__remember">
              <input
                type="checkbox"
                className="login__checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Recuérdame
            </label>

            <button type="button" className="login__link btn btn-link p-0" onClick={openForgot}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error ? <p className="login__error" style={{ color: "#ffd2d2" }}>{error}</p> : null}

          <button type="submit" className="login__button">Login</button>

          <p className="login__register">
            ¿No tienes una cuenta? <Link className="login__link" to="/registro">Registrar</Link>
          </p>
        </form>
      </section>

      <dialog id="forgotDialog" style={{ border: "none", borderRadius: 12, padding: 0, maxWidth: 420, width: "92vw" }}>
        <div style={{ padding: 16 }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="m-0 fs-5">Recuperar contraseña</h3>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={closeForgot}>Cerrar</button>
          </div>

          {forgotStep === "email" && (
            <form onSubmit={handleForgotEmail} className="modal-body p-0">
              <p className="mb-2">Ingresa tu correo y te enviaremos un código de recuperación.</p>
              <div className="mb-3">
                <label htmlFor="forgotEmail" className="form-label">Correo</label>
                <input
                  id="forgotEmail"
                  type="email"
                  className="form-control"
                  placeholder="tu@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              {forgotErr ? <p className="m-0" style={{ color: "#b00020" }}>{forgotErr}</p> : null}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={closeForgot}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Enviar código</button>
              </div>
            </form>
          )}

          {forgotStep === "code" && (
            <div className="modal-body p-0">
              <p>Se ha enviado un código de recuperación a tu correo.</p>
              <p className="small text-muted m-0">(Para la demo, tu código es <strong>{demoCode}</strong>)</p>

              <div className="d-flex align-items-center gap-2 mt-3">
                <input
                  id="forgotCode"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  className="form-control"
                  placeholder="000000"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const input = e.currentTarget;
                      confirmCode((input.value || "").trim());
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const input = document.getElementById("forgotCode");
                    const value = input && "value" in input ? input.value : "";
                    confirmCode((value || "").trim());
                  }}
                >
                  Confirmar
                </button>
              </div>

              {forgotErr ? <p className="m-0 mt-2" style={{ color: "#b00020" }}>{forgotErr}</p> : null}
            </div>
          )}
        </div>
      </dialog>
    </main>
  );
}
