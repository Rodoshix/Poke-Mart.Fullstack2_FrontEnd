import AdminSidebarNavItem from "./AdminSidebarNavItem.jsx";

const AdminSidebarNavigation = ({ items, onNavigate }) => (
  <nav className="admin-sidebar__nav" aria-label="Menú principal administrador">
    {items.map((item) => (
      <AdminSidebarNavItem key={item.to} {...item} onNavigate={onNavigate} />
    ))}
  </nav>
);

export default AdminSidebarNavigation;
