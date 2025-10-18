import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, getProfile, clearAuth } from "./session.js";

export const AuthMenu = () => {
  const [sessionOK, setSessionOK] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const prof = getProfile();
    setSessionOK(!!auth && !!prof);
    setProfile(prof);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  if (!sessionOK) {
    return (
      <div>
        <NavLink className="site-nav__auth-link link-secondary me-2" to="/login">Iniciar sesión</NavLink>
        <span className="text-body-secondary">|</span>
        <NavLink className="site-nav__auth-link link-secondary ms-2" to="/registro">Registrar usuario</NavLink>
      </div>
    );
  }

  const displayName = profile?.nombre || profile?.username || "Usuario";
  const email = profile?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="dropdown">
      <button
        className="btn btn-light border-0 d-flex align-items-center gap-2"
        type="button"
        id="userMenuBtn"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div
          className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
          style={{ width: 32, height: 32 }}
        >
          {initial}
        </div>
        <div className="text-start">
          <div className="fw-semibold lh-1">{displayName}</div>
          <small className="text-muted d-block text-truncate" style={{ maxWidth: 160 }} title={email}>
            {email}
          </small>
        </div>
      </button>
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuBtn">
        <li><button className="dropdown-item" type="button" onClick={handleLogout}>Cerrar sesión</button></li>
      </ul>
    </div>
  );
};
