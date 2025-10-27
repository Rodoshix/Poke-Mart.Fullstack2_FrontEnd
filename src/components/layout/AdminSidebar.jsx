import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import brandLogo from "@/assets/img/poke-mark-logo.png";
import { clearAuth } from "@/components/auth/session.js";
import useAuthSession from "@/hooks/useAuthSession.js";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", code: "DB", end: true },
  { to: "/admin/ordenes", label: "Órdenes", code: "OR" },
  { to: "/admin/productos", label: "Productos", code: "PR" },
  { to: "/admin/categorias", label: "Categorías", code: "CT" },
  { to: "/admin/usuarios", label: "Usuarios", code: "US" },
  { to: "/admin/reportes", label: "Reportes", code: "RP" },
];

const AdminSidebar = ({ isOpen, onHide }) => {
  const navigate = useNavigate();
  const { profile } = useAuthSession();

  const computedProfile = useMemo(() => {
    const fallback = {
      name: "Admin Poké Mart",
      email: "admin@duoc.cl",
      avatar: brandLogo,
    };

    if (!profile) return fallback;

    const fullName =
      [profile.nombre, profile.apellido].filter(Boolean).join(" ") ||
      profile.name ||
      profile.username ||
      fallback.name;

    return {
      name: fullName,
      email: profile.email || fallback.email,
      avatar: profile.avatarUrl || profile.avatar || fallback.avatar,
    };
  }, [profile]);

  const handleStoreRedirect = () => {
    navigate("/", { replace: false });
    if (onHide) onHide();
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/", { replace: true });
    if (onHide) onHide();
  };

  const handleNavigate = () => {
    if (onHide) onHide();
  };

  return (
    <aside className="admin-sidebar" data-open={isOpen}>
      <div>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-logo">
            <img src={brandLogo} alt="Poké Mart" width="26" height="26" />
          </span>
          <div>
            <div className="admin-sidebar__brand-title">Poké Mart</div>
            <div className="admin-sidebar__tagline">Panel administrador</div>
          </div>
        </div>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Menú principal administrador">
        {NAV_ITEMS.map(({ to, label, code, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "admin-sidebar__link",
                isActive ? "is-active" : "",
              ].join(" ").trim()
            }
            onClick={handleNavigate}
          >
            <span className="admin-sidebar__icon" aria-hidden="true">{code}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__actions">
        <button
          type="button"
          className="admin-sidebar__button admin-sidebar__button--primary"
          onClick={handleStoreRedirect}
        >
          Ir a la tienda
        </button>
        <button
          type="button"
          className="admin-sidebar__button admin-sidebar__button--danger"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>

      <Link
        to="/admin/perfil"
        className="admin-sidebar__profile"
        onClick={handleNavigate}
      >
        <img
          src={computedProfile.avatar}
          alt={computedProfile.name}
          className="admin-sidebar__avatar"
          width="40"
          height="40"
        />
        <span className="admin-sidebar__profile-meta">
          <span className="admin-sidebar__profile-name">{computedProfile.name}</span>
          <span className="admin-sidebar__profile-email">{computedProfile.email}</span>
        </span>
      </Link>
    </aside>
  );
};

export default AdminSidebar;
