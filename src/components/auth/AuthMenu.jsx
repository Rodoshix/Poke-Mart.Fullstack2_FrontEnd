// src/components/auth/AuthMenu.jsx
import { Link, useNavigate } from "react-router-dom";
import useAuthSession from "@/hooks/useAuthSession";
import { clearAuth } from "@/components/auth/session";

function getDisplayName(profile) {
  const name = [profile?.nombre, profile?.apellido].filter(Boolean).join(" ").trim();
  return name || profile?.username || "Usuario";
}
function getInitial(profile) {
  const base = getDisplayName(profile);
  return base?.charAt(0)?.toUpperCase() || "U";
}

export default function AuthMenu() {
  const navigate = useNavigate();
  const { session, profile } = useAuthSession();
  const isLogged = !!session && !!profile;

  if (!isLogged) {
    return (
      <div className="header-auth d-flex align-items-center">
        <Link
          to="/login"
          className="btn btn-sm btn-outline-primary rounded-pill auth-btn"
          title="Iniciar sesión"
        >
          <i className="bi bi-box-arrow-in-right" aria-hidden="true"></i>
          <span className="btn-label">Iniciar sesión</span>
        </Link>

        <span className="auth-divider mx-2">|</span>

        <Link
          to="/registro"
          className="btn btn-sm btn-primary rounded-pill auth-btn"
          title="Registrar usuario"
        >
          <i className="bi bi-person-plus" aria-hidden="true"></i>
          <span className="btn-label">Registrar</span>
        </Link>
      </div>
    );
  }

  const name = getDisplayName(profile);
  const email = profile?.email || "";

  return (
    <div className="header-auth d-flex align-items-center gap-2">
      <div className="auth-chip d-flex align-items-center">
        <div className="auth-avatar" aria-hidden="true">{getInitial(profile)}</div>
        <div className="auth-meta">
          <div className="auth-name" title={name}>{name}</div>
          <div className="auth-email" title={email}>{email}</div>
        </div>
      </div>

      <button
        className="btn btn-sm btn-outline-danger rounded-pill auth-btn"
        title="Cerrar sesión"
        onClick={() => {
          clearAuth();
          navigate("/", { replace: true });
        }}
      >
        <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
        <span className="btn-label">Cerrar sesión</span>
      </button>
    </div>
  );
}
