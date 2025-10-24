const AdminTopbar = ({ onToggleSidebar }) => {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <button
          type="button"
          className="admin-topbar__toggle"
          onClick={onToggleSidebar}
          aria-label="Abrir o cerrar menú lateral"
        >
          Menú
        </button>
        <span className="admin-topbar__title">Panel administrador</span>
      </div>
      <div className="admin-topbar__actions">
        <span>Hoy es {new Date().toLocaleDateString("es-CL")}</span>
      </div>
    </header>
  );
};

export default AdminTopbar;
