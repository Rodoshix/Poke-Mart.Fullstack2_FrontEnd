import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useUsersData from "@/hooks/useUsersData.js";
import UserFilters from "@/components/users/UserFilters.jsx";
import UserTable from "@/components/users/UserTable.jsx";

const SORT_OPTIONS = [
  { value: "id-asc", label: "ID ascendente" },
  { value: "recent", label: "Más recientes" },
  { value: "name", label: "Nombre A-Z" },
  { value: "role", label: "Rol" },
];

const THIRTY_DAYS = 30 * 86_400_000;
const numberFormatter = new Intl.NumberFormat("es-CL");

const AdminUsers = () => {
  const users = useUsersData();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [sortOption, setSortOption] = useState("id-asc");

  const enrichedUsers = useMemo(
    () =>
      (users ?? []).map((user) => {
        const registeredDate = user.registeredAt ? new Date(user.registeredAt) : null;
        return {
          ...user,
          fullName: `${user.nombre ?? ""} ${user.apellido ?? ""}`.trim(),
          registeredDate,
        };
      }),
    [users],
  );

  const roles = useMemo(() => {
    const set = new Set(enrichedUsers.map((user) => user.role).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [enrichedUsers]);

  const regions = useMemo(() => {
    const set = new Set(enrichedUsers.map((user) => user.region).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [enrichedUsers]);

  const metrics = useMemo(() => {
    const totalUsers = enrichedUsers.length;
    const totalAdmins = enrichedUsers.filter((user) => user.role === "admin").length;
    const totalClients = enrichedUsers.filter((user) => user.role !== "admin").length;
    const recentUsers = enrichedUsers.filter((user) => {
      if (!user.registeredDate) return false;
      return Date.now() - user.registeredDate.getTime() <= THIRTY_DAYS;
    }).length;
    const activeRegions = new Set(enrichedUsers.map((user) => user.region).filter(Boolean)).size;

    return { totalUsers, totalAdmins, totalClients, recentUsers, activeRegions };
  }, [enrichedUsers]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return enrichedUsers.filter((user) => {
      const matchesTerm =
        !term ||
        user.fullName.toLowerCase().includes(term) ||
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.run?.toLowerCase().includes(term);
      const matchesRole = selectedRole ? user.role === selectedRole : true;
      const matchesRegion = selectedRegion ? user.region === selectedRegion : true;
      return matchesTerm && matchesRole && matchesRegion;
    });
  }, [enrichedUsers, searchTerm, selectedRole, selectedRegion]);

  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];
    switch (sortOption) {
      case "name":
        list.sort((a, b) => a.fullName.localeCompare(b.fullName, "es"));
        break;
      case "role":
        list.sort((a, b) => a.role.localeCompare(b.role));
        break;
      case "recent":
        list.sort((a, b) => {
          const valueA = a.registeredDate ? a.registeredDate.getTime() : 0;
          const valueB = b.registeredDate ? b.registeredDate.getTime() : 0;
          return valueB - valueA;
        });
        break;
      case "id-asc":
      default:
        list.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
    }
    return list;
  }, [filteredUsers, sortOption]);

  const status = location.state?.status;
  const userId = location.state?.userId;
  const feedbackMessage = useMemo(() => {
    switch (status) {
      case "created":
        return `El usuario #${userId} se agregó correctamente.`;
      case "updated":
        return `Los cambios del usuario #${userId} se guardaron correctamente.`;
      case "reset":
        return "El listado de usuarios se restauró a su estado original.";
      default:
        return "";
    }
  }, [status, userId]);

  useEffect(() => {
    if (!feedbackMessage) return undefined;
    const timeout = setTimeout(() => {
      navigate(location.pathname, { replace: true });
    }, 4000);
    return () => clearTimeout(timeout);
  }, [feedbackMessage, navigate, location.pathname]);

  useEffect(() => {
    if (status === "created") {
      setSortOption("id-asc");
    }
  }, [status]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedRegion("");
    setSortOption("id-asc");
  };

  return (
    <section className="admin-paper admin-users">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Usuarios</h1>
        <p className="admin-page-subtitle">
          Gestiona perfiles, permisos y el historial de registro de los clientes y del equipo administrativo.
        </p>
      </div>

      <div className="admin-users__summary">
        <article>
          <span className="admin-users__summary-label">Usuarios totales</span>
          <strong className="admin-users__summary-value">
            {numberFormatter.format(metrics.totalUsers)}
          </strong>
          <small>{numberFormatter.format(metrics.totalClients)} clientes activos</small>
        </article>
        <article>
          <span className="admin-users__summary-label">Administradores</span>
          <strong className="admin-users__summary-value">
            {numberFormatter.format(metrics.totalAdmins)}
          </strong>
          <small>Incluye cuentas con permisos elevados</small>
        </article>
        <article>
          <span className="admin-users__summary-label">Nuevos en 30 días</span>
          <strong className="admin-users__summary-value">
            {numberFormatter.format(metrics.recentUsers)}
          </strong>
          <small>Usuarios registrados en el último mes</small>
        </article>
        <article>
          <span className="admin-users__summary-label">Regiones representadas</span>
          <strong className="admin-users__summary-value">
            {numberFormatter.format(metrics.activeRegions)}
          </strong>
          <small>Distribución geográfica de los usuarios</small>
        </article>
      </div>

      <div className="admin-users__actions">
        <Link
          to="/admin/usuarios/nuevo"
          className="admin-products__action-button admin-products__action-button--primary"
        >
          + Agregar usuario
        </Link>
      </div>

      <UserFilters
        roles={roles}
        regions={regions}
        sortOptions={SORT_OPTIONS}
        selectedRole={selectedRole}
        selectedRegion={selectedRegion}
        sortOption={sortOption}
        searchTerm={searchTerm}
        onRoleChange={setSelectedRole}
        onRegionChange={setSelectedRegion}
        onSortChange={setSortOption}
        onSearchChange={setSearchTerm}
        onReset={
          selectedRole || selectedRegion || searchTerm || sortOption !== "id-asc"
            ? handleResetFilters
            : undefined
        }
      />

      {feedbackMessage && (
        <div className="admin-products__alert" role="status">
          {feedbackMessage}
        </div>
      )}

      <UserTable users={sortedUsers} />
    </section>
  );
};

export default AdminUsers;
