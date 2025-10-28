import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserById } from "@/services/userService.js";
import OrderTable from "@/components/orders/OrderTable.jsx";
import useOrdersData from "@/hooks/useOrdersData.js";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const AdminUserHistory = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const orders = useOrdersData();
  const normalizedOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders],
  );

  const user = useMemo(() => {
    if (!id) return null;
    if (Number.isNaN(numericId)) return null;
    return getUserById(numericId) ?? null;
  }, [id, numericId]);

  const userOrders = useMemo(() => {
    if (!user) return [];
    const normalizedEmail = (user.email ?? "").trim().toLowerCase();

    return normalizedOrders.filter((order) => {
      const orderCustomerId = Number(order.customerId);
      if (!Number.isNaN(orderCustomerId) && orderCustomerId === numericId) {
        return true;
      }
      if (normalizedEmail) {
        const orderEmail = (order.customerEmail ?? "").trim().toLowerCase();
        if (orderEmail && orderEmail === normalizedEmail) {
          return true;
        }
      }
      return false;
    });
  }, [normalizedOrders, numericId, user]);

  const metrics = useMemo(() => {
    if (!user || userOrders.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageTicket: 0,
        lastOrderAt: null,
      };
    }

    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
    const averageTicket = Math.round(totalSpent / totalOrders);
    const lastOrderAtTimestamp = userOrders.reduce((latest, order) => {
      const timestamp = new Date(order.createdAt).getTime();
      return Number.isNaN(timestamp) ? latest : Math.max(latest, timestamp);
    }, 0);

    return {
      totalOrders,
      totalSpent,
      averageTicket,
      lastOrderAt: lastOrderAtTimestamp ? new Date(lastOrderAtTimestamp) : null,
    };
  }, [user, userOrders]);

  if (!id || Number.isNaN(numericId)) {
    return (
      <section className="admin-paper admin-user-history">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Historial de usuario</h1>
          <p className="admin-page-subtitle">
            Selecciona un usuario válido para revisar su historial de compras.
          </p>
        </div>
        <Link
          to="/admin/usuarios"
          className="admin-products__action-button admin-products__action-button--primary"
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="admin-paper admin-user-history">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Usuario no encontrado</h1>
          <p className="admin-page-subtitle">
            No pudimos localizar al usuario #{id}. Comprueba el identificador o regresa al listado general.
          </p>
        </div>
        <Link
          to="/admin/usuarios"
          className="admin-products__action-button admin-products__action-button--primary"
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-paper admin-user-history">
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Historial de {user.nombre} {user.apellido}
        </h1>
        <p className="admin-page-subtitle">
          Revisa las órdenes asociadas al cliente, junto a un resumen de su comportamiento de compra.
        </p>
      </div>

      <div className="admin-user-history__header">
        <div className="admin-user-history__identity">
          <h2 className="admin-user-history__identity-name">
            {user.nombre} {user.apellido}
          </h2>
          <dl className="admin-user-history__identity-meta">
            <div>
              <dt>Usuario</dt>
              <dd>{user.username}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{user.email || "—"}</dd>
            </div>
            <div>
              <dt>RUN</dt>
              <dd>{user.run || "—"}</dd>
            </div>
            <div>
              <dt>Región</dt>
              <dd>{user.region || "—"}</dd>
            </div>
          </dl>
        </div>
        <Link to={`/admin/usuarios/${user.id}`} className="admin-users__action admin-user-history__profile-link">
          Ver perfil completo
        </Link>
      </div>

      <div className="admin-user-history__metrics">
        <article>
          <span className="admin-user-history__metric-label">Órdenes totales</span>
          <strong className="admin-user-history__metric-value">{metrics.totalOrders}</strong>
          <small>Registros disponibles en la base histórica</small>
        </article>
        <article>
          <span className="admin-user-history__metric-label">Monto acumulado</span>
          <strong className="admin-user-history__metric-value">
            {currencyFormatter.format(metrics.totalSpent)}
          </strong>
          <small>Incluye impuestos y envíos</small>
        </article>
        <article>
          <span className="admin-user-history__metric-label">Ticket promedio</span>
          <strong className="admin-user-history__metric-value">
            {currencyFormatter.format(metrics.averageTicket)}
          </strong>
          <small>
            {metrics.totalOrders > 0
              ? `Promedio sobre ${metrics.totalOrders} órdenes`
              : "Sin órdenes registradas"}
          </small>
        </article>
        <article>
          <span className="admin-user-history__metric-label">Última compra</span>
          <strong className="admin-user-history__metric-value">
            {metrics.lastOrderAt ? dateFormatter.format(metrics.lastOrderAt) : "Sin registros"}
          </strong>
          <small>Basado en el historial disponible</small>
        </article>
      </div>

      <div className="admin-user-history__orders">
        <h3 className="admin-user-history__orders-title">Órdenes registradas</h3>
        {userOrders.length === 0 ? (
          <div className="admin-user-history__empty">
            <p>No existen órdenes asociadas a este usuario en la base histórica.</p>
            <p>
              Cuando el usuario realice compras en la tienda, verás cada registro en este listado.
            </p>
          </div>
        ) : (
          <OrderTable orders={userOrders} />
        )}
      </div>
    </section>
  );
};

export default AdminUserHistory;
