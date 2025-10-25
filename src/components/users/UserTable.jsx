import { Link } from "react-router-dom";
import useAuthSession from "@/hooks/useAuthSession.js";

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const UserTable = ({ users }) => {
  const { profile } = useAuthSession();
  const activeAdminId = profile?.id != null ? Number(profile.id) : null;

  return (
    <div className="admin-users__table-wrapper">
      <table className="admin-table admin-users__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Ubicación</th>
            <th>Registrado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={8} className="admin-table__empty">
                No se encontraron usuarios con los filtros actuales.
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const isActiveAdmin = activeAdminId != null && Number(user.id) === activeAdminId;
              const editHref = isActiveAdmin ? "/admin/perfil" : `/admin/usuarios/${user.id}`;

              return (
                <tr key={user.id}>
                  <td className="admin-table__cell--mono">{user.id}</td>
                  <td>{user.username}</td>
                  <td>{`${user.nombre} ${user.apellido}`.trim()}</td>
                  <td>{user.email}</td>
                  <td className="admin-users__role">{user.role}</td>
                  <td>{[user.comuna, user.region].filter(Boolean).join(", ") || "—"}</td>
                  <td>
                    {user.registeredAt
                      ? dateFormatter.format(new Date(user.registeredAt))
                      : "—"}
                  </td>
                  <td className="admin-users__actions-cell">
                    <Link to={editHref} className="admin-users__action">
                      Ver / Editar
                    </Link>
                    <Link
                      to={`/admin/usuarios/${user.id}/historial`}
                      className="admin-users__action admin-users__action--secondary"
                    >
                      Historial
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
