const AdminSidebarActions = ({ onStoreRedirect, onLogout }) => (
  <div className="admin-sidebar__actions">
    <button
      type="button"
      className="admin-sidebar__button admin-sidebar__button--primary"
      onClick={onStoreRedirect}
    >
      Ir a la tienda
    </button>
    <button
      type="button"
      className="admin-sidebar__button admin-sidebar__button--danger"
      onClick={onLogout}
    >
      Cerrar sesión
    </button>
  </div>
);

export default AdminSidebarActions;
