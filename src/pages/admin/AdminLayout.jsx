import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar.jsx";
import AdminTopbar from "@/components/layout/AdminTopbar.jsx";
import AdminFooter from "@/components/layout/AdminFooter.jsx";
import useAuthSession from "@/hooks/useAuthSession.js";
import "@/assets/styles/admin.css";

const DESKTOP_BREAKPOINT = 992;

const isDesktopViewport = () => (typeof window === "undefined" ? true : window.innerWidth >= DESKTOP_BREAKPOINT);

const sellerAllowedPath = (pathname = "") => {
  if (!pathname.startsWith("/admin")) return false;
  if (pathname === "/admin" || pathname === "/admin/") return true;
  if (pathname.startsWith("/admin/ordenes")) return true;
  if (pathname.startsWith("/admin/productos")) {
    const disallowedProductPaths = [
      "/admin/productos/nuevo",
      "/admin/productos/criticos",
      "/admin/productos/reportes",
    ];
    return !disallowedProductPaths.some((prefix) => pathname.startsWith(prefix));
  }
  return false;
};

const AdminLayout = () => {
  const { session, profile } = useAuthSession();
  const location = useLocation();
  const role = (profile?.role || "").toLowerCase();
  const isAdmin = !!session && !!profile && role === "admin";
  const isSeller = !!session && !!profile && role === "vendedor";
  const isAuthorized = isAdmin || isSeller;
  const [isDesktop, setIsDesktop] = useState(() => isDesktopViewport());
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => isDesktopViewport());

  useEffect(() => {
    if (!isAuthorized || typeof window === "undefined") return;
    const handleResize = () => {
      const desktop = isDesktopViewport();
      setIsDesktop(desktop);
      setIsSidebarOpen((prev) => (desktop ? true : prev));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAuthorized]);

  useEffect(() => {
    if (!isAuthorized || typeof document === "undefined") return;

    const previousPadding = document.body.style.paddingTop;
    const previousBackground = document.body.style.background;

    document.body.style.paddingTop = "0";
    document.body.style.background = "var(--admin-bg)";

    return () => {
      document.body.style.paddingTop = previousPadding;
      document.body.style.background = previousBackground;
    };
  }, [isAuthorized]);

  const handleToggleSidebar = () => {
    if (isDesktop) return;
    setIsSidebarOpen((prev) => !prev);
  };

  const handleHideSidebar = () => {
    if (isDesktop) return;
    setIsSidebarOpen(false);
  };

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  if (isSeller && !sellerAllowedPath(location.pathname || "")) {
    return <Navigate to="/admin/ordenes" replace />;
  }

  return (
    <div className={`admin-shell ${isSidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>
      {!isDesktop && isSidebarOpen && (
        <button className="admin-shell__overlay" type="button" onClick={handleHideSidebar} aria-label="Cerrar menú" />
      )}
      <AdminSidebar isOpen={isSidebarOpen} onHide={handleHideSidebar} role={role} />
      <div className="admin-shell__content">
        <AdminTopbar onToggleSidebar={handleToggleSidebar} />
        <main className="admin-main">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
