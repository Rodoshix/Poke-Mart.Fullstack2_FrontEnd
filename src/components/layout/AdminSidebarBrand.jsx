import brandLogo from "@/assets/img/poke-mark-logo.png";

const AdminSidebarBrand = () => (
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
);

export default AdminSidebarBrand;
