import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import brandLogo from "@/assets/img/poke-mark-logo.png";
import { clearAuth } from "@/components/auth/session.js";
import useAuthSession from "@/hooks/useAuthSession.js";
import ADMIN_SIDEBAR_NAV_ITEMS from "./adminSidebarNavItems.js";
import AdminSidebarBrand from "./AdminSidebarBrand.jsx";
import AdminSidebarNavigation from "./AdminSidebarNavigation.jsx";
import AdminSidebarActions from "./AdminSidebarActions.jsx";
import AdminSidebarProfile from "./AdminSidebarProfile.jsx";

const filterNavItemsByRole = (items, role) => {
  const normalized = (role || "").toLowerCase();
  if (normalized === "vendedor") {
    return items.filter((item) => item.code === "OR" || item.code === "PR");
  }
  return items;
};

const AdminSidebar = ({ isOpen, onHide, role }) => {
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

  const navItems = useMemo(
    () => filterNavItemsByRole(ADMIN_SIDEBAR_NAV_ITEMS, role || profile?.role),
    [role, profile]
  );

  const handleStoreRedirect = () => {
    navigate("/", { replace: false });
    onHide?.();
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/", { replace: true });
    onHide?.();
  };

  const handleNavigate = () => {
    onHide?.();
  };

  return (
    <aside className="admin-sidebar" data-open={isOpen}>
      <AdminSidebarBrand />
      <AdminSidebarNavigation items={navItems} onNavigate={handleNavigate} />
      <AdminSidebarActions
        onStoreRedirect={handleStoreRedirect}
        onLogout={handleLogout}
      />
      <AdminSidebarProfile profile={computedProfile} onNavigate={handleNavigate} />
    </aside>
  );
};

export default AdminSidebar;
