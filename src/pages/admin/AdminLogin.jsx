import brandLogo from "@/assets/img/poke-mark-logo.png";
import "@/assets/styles/admin.css";

const AdminLogin = () => (
  <div className="admin-login">
    <div className="admin-login__card">
      <div className="admin-login__brand">
        <span className="admin-login__logo">
          <img src={brandLogo} alt="Poké Mart" width="42" height="42" />
        </span>
        <div>
          <h1 className="admin-login__title">Panel Poké Mart</h1>
          <p className="admin-login__subtitle">Inicia sesión para gestionar la tienda</p>
        </div>
      </div>
      <div className="admin-login__placeholder">
        <p>Pronto conectaremos el formulario de acceso del administrador.</p>
        <p>Si necesitas volver a la tienda, usa el botón de la barra lateral.</p>
      </div>
    </div>
  </div>
);

export default AdminLogin;
