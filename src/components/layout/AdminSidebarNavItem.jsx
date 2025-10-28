import { NavLink } from "react-router-dom";

const AdminSidebarNavItem = ({ to, label, code, end, onNavigate }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      ["admin-sidebar__link", isActive ? "is-active" : ""].join(" ").trim()
    }
    onClick={onNavigate}
  >
    <span className="admin-sidebar__icon" aria-hidden="true">
      {code}
    </span>
    <span>{label}</span>
  </NavLink>
);

export default AdminSidebarNavItem;
