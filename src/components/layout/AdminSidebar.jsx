import { Link, NavLink, useNavigate } from "react-router-dom";
import brandLogo from "@/assets/img/poke-mark-logo.png";
import { clearAuth, getProfile } from "@/components/auth/session.js";
import { useMemo } from "react";

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

  const profile = useMemo(() => {
    const fallback = {
      name: "Admin Poké Mart",
      email: "admin@pokemart.cl",
      avatar: brandLogo,
    };

    const data = getProfile();
    if (!data) return fallback;

    return {
      name: data?.name || fallback.name,
      email: data?.email || fallback.email,
      avatar: data?.avatar || fallback.avatar,
    };
  }, []);

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
          src={profile.avatar}
          alt={profile.name}
          className="admin-sidebar__avatar"
          width="40"
          height="40"
        />
        <span className="admin-sidebar__profile-meta">
          <span className="admin-sidebar__profile-name">{profile.name}</span>
          <span className="admin-sidebar__profile-email">{profile.email}</span>
        </span>
      </Link>
    </aside>
  );
};

export default AdminSidebar;
