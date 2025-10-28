import { Link } from "react-router-dom";

const AdminSidebarProfile = ({ profile, onNavigate }) => (
  <Link to="/admin/perfil" className="admin-sidebar__profile" onClick={onNavigate}>
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
);

export default AdminSidebarProfile;
