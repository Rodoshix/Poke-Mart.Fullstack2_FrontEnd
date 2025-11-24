import { useMemo } from "react";
import useOrdersData from "@/hooks/useOrdersData.js";
import useAdminProducts from "@/hooks/useAdminProducts.js";
import useUsersData from "@/hooks/useUsersData.js";

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("es-CL");
const THIRTY_DAYS = 30 * 86_400_000;

const normalizeRole = (role = "") => role.toString().trim().toLowerCase();

const AdminReports = () => {
  const orders = useOrdersData();
  const products = useAdminProducts();
  const users = useUsersData();
  const normalizedOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders],
  );

  const productById = useMemo(() => {
    const map = new Map();
    (products || []).forEach((product) => {
      map.set(product.id, product);
    });
    return map;
  }, [products]);

  const summary = useMemo(() => {
    const now = Date.now();
    const safeUsers = Array.isArray(users) ? users : [];
    const safeProducts = Array.isArray(products) ? products : [];
    const totalUsers = safeUsers.length;
    const totalProducts = safeProducts.length;
    const totalOrders = normalizedOrders.length;
    const totalRevenue = normalizedOrders.reduce(
      (acc, order) => acc + (Number(order.total) || 0),
      0,
    );
    const recentOrders = normalizedOrders.filter((order) => {
      const timestamp = new Date(order.createdAt).getTime();
      return !Number.isNaN(timestamp) && now - timestamp <= THIRTY_DAYS;
    });
    const revenueLast30 = recentOrders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
    const averageTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const newUsers = safeUsers.filter((user) => {
      const timestamp = new Date(user.registeredAt).getTime();
      return !Number.isNaN(timestamp) && now - timestamp <= THIRTY_DAYS;
    }).length;

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      averageTicket,
      revenueLast30,
      newUsers,
    };
  }, [normalizedOrders, products, users]);

  const userInsights = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : [];
    const admins = safeUsers.filter((user) => normalizeRole(user.role) === "admin");
    const clients = safeUsers.length - admins.length;
    const now = Date.now();
    const newUsers = safeUsers.filter((user) => {
      const timestamp = new Date(user.registeredAt).getTime();
      return !Number.isNaN(timestamp) && now - timestamp <= THIRTY_DAYS;
    }).length;

    const regionsCount = safeUsers.reduce((acc, user) => {
      const region = user.region || "Sin región";
      acc.set(region, (acc.get(region) ?? 0) + 1);
      return acc;
    }, new Map());
    const topRegions = Array.from(regionsCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([region, count]) => ({
        region,
        count,
      }));

    return {
      admins: admins.length,
      clients,
      newUsers,
      topRegions,
    };
  }, [users]);

  const productInsights = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    const categoriesCount = safeProducts.reduce((acc, product) => {
      const category = product.categoria || "Sin categoría";
      acc.set(category, (acc.get(category) ?? 0) + 1);
      return acc;
    }, new Map());

    const topCategories = Array.from(categoriesCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([category, count]) => ({ category, count }));

    const lowStock = safeProducts
      .filter((product) => product.stock <= Math.max(5, Math.round(product.stockBase * 0.15)))
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    const stockCoverage =
      safeProducts.length > 0
        ? Math.round(
            (safeProducts.reduce((acc, product) => {
              const base = product.stockBase || 1;
              const ratio = Math.max(0, Math.min(1, product.stock / base));
              return acc + ratio;
            }, 0) /
              safeProducts.length) *
              100,
          )
        : 0;

    return {
      topCategories,
      lowStock,
      stockCoverage,
    };
  }, [products]);

  const orderInsights = useMemo(() => {
    const statusCount = normalizedOrders.reduce((acc, order) => {
      const status = order.status || "unknown";
      acc.set(status, (acc.get(status) ?? 0) + 1);
      return acc;
    }, new Map());
    const statusList = Array.from(statusCount.entries()).map(([status, count]) => ({
      status: status === "completed" ? "Completadas" : status,
      count,
    }));

    const now = Date.now();
    const lastOrderTimestamp = normalizedOrders.reduce((latest, order) => {
      const timestamp = new Date(order.createdAt).getTime();
      if (Number.isNaN(timestamp)) return latest;
      return Math.max(latest, timestamp);
    }, 0);

    const lastOrder = lastOrderTimestamp ? new Date(lastOrderTimestamp) : null;
    const overdueOrders = normalizedOrders.filter((order) => {
      if (!order.statusHistory || order.statusHistory.length === 0) return false;
      const finalStatus = order.statusHistory[order.statusHistory.length - 1]?.status;
      if (finalStatus === "completed" || finalStatus === "cancelled") return false;
      const created = new Date(order.createdAt).getTime();
      return !Number.isNaN(created) && now - created > 7 * 86_400_000;
    }).length;

    return {
      statusList,
      lastOrder,
      overdueOrders,
    };
  }, [normalizedOrders]);

  const topCustomers = useMemo(() => {
    const map = new Map();
    normalizedOrders.forEach((order) => {
      const key = order.customerEmail || order.customerId || order.customer;
      if (!key) return;
      const existing = map.get(key) ?? {
        name: order.customer || "Cliente",
        email: order.customerEmail || "Sin correo",
        orders: 0,
        total: 0,
      };
      existing.orders += 1;
      existing.total += Number(order.total) || 0;
      map.set(key, existing);
    });

    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [normalizedOrders]);

  const topProducts = useMemo(() => {
    const map = new Map();
    normalizedOrders.forEach((order) => {
      (order.items ?? []).forEach((item) => {
        const productId = item.productId ?? item.sku;
        if (productId == null) return;
        const key = Number(productId);
        const existing = map.get(key) ?? {
          productId: key,
          quantity: 0,
          revenue: 0,
        };
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        existing.quantity += quantity;
        existing.revenue += quantity * unitPrice;
        map.set(key, existing);
      });
    });

    return Array.from(map.values())
      .map((entry) => ({
        ...entry,
        name: productById.get(entry.productId)?.nombre ?? `Producto ${entry.productId}`,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [normalizedOrders, productById]);

  return (
    <section className="admin-paper admin-reports">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reportes y métricas</h1>
        <p className="admin-page-subtitle">
          Analiza el rendimiento general de la tienda: ventas, comportamiento de usuarios y estado del inventario.
        </p>
      </div>

      <div className="admin-reports__summary">
        <article>
          <h2>Ingresos acumulados</h2>
          <strong>{CURRENCY_FORMATTER.format(summary.totalRevenue)}</strong>
          <small>Incluye todas las órdenes registradas en el histórico</small>
        </article>
        <article>
          <h2>Ticket promedio</h2>
          <strong>{CURRENCY_FORMATTER.format(summary.averageTicket)}</strong>
          <small>Promedio sobre {NUMBER_FORMATTER.format(summary.totalOrders)} órdenes totales</small>
        </article>
        <article>
          <h2>Órdenes últimos 30 días</h2>
          <strong>{CURRENCY_FORMATTER.format(summary.revenueLast30)}</strong>
          <small>Ingresos recientes ({NUMBER_FORMATTER.format(summary.newUsers)} nuevos usuarios)</small>
        </article>
        <article>
          <h2>Inventario activo</h2>
          <strong>{NUMBER_FORMATTER.format(summary.totalProducts)} productos</strong>
          <small>{NUMBER_FORMATTER.format(summary.totalUsers)} usuarios registrados</small>
        </article>
      </div>

      <div className="admin-reports__grid">
        <section className="admin-reports__panel">
          <header>
            <h3>Usuarios</h3>
            <span>{NUMBER_FORMATTER.format(summary.totalUsers)} totales</span>
          </header>
          <ul>
            <li>
              <span>Administradores</span>
              <strong>{NUMBER_FORMATTER.format(userInsights.admins)}</strong>
            </li>
            <li>
              <span>Clientes</span>
              <strong>{NUMBER_FORMATTER.format(userInsights.clients)}</strong>
            </li>
            <li>
              <span>Nuevos (30 días)</span>
              <strong>{NUMBER_FORMATTER.format(userInsights.newUsers)}</strong>
            </li>
          </ul>
          <footer>
            <h4>Regiones principales</h4>
            <ol>
              {userInsights.topRegions.map(({ region, count }) => (
                <li key={region}>
                  <span>{region}</span>
                  <span>{NUMBER_FORMATTER.format(count)} usuarios</span>
                </li>
              ))}
              {userInsights.topRegions.length === 0 && <li>No hay datos regionales</li>}
            </ol>
          </footer>
        </section>

        <section className="admin-reports__panel">
          <header>
            <h3>Inventario</h3>
            <span>{NUMBER_FORMATTER.format(summary.totalProducts)} productos</span>
          </header>
          <ul>
            <li>
              <span>Stock saludable</span>
              <strong>{productInsights.stockCoverage}%</strong>
            </li>
            <li>
              <span>Categorías activas</span>
              <strong>{NUMBER_FORMATTER.format(productInsights.topCategories.length)}</strong>
            </li>
            <li>
              <span>Productos críticos</span>
              <strong>{NUMBER_FORMATTER.format(productInsights.lowStock.length)}</strong>
            </li>
          </ul>
          <footer>
            <h4>Categorías destacadas</h4>
            <ol>
              {productInsights.topCategories.map(({ category, count }) => (
                <li key={category}>
                  <span>{category}</span>
                  <span>{NUMBER_FORMATTER.format(count)}</span>
                </li>
              ))}
              {productInsights.topCategories.length === 0 && <li>No hay datos de categorías</li>}
            </ol>
          </footer>
        </section>

        <section className="admin-reports__panel">
          <header>
            <h3>Órdenes</h3>
            <span>{NUMBER_FORMATTER.format(summary.totalOrders)} totales</span>
          </header>
          <ul>
            <li>
              <span>Ingresos históricos</span>
              <strong>{CURRENCY_FORMATTER.format(summary.totalRevenue)}</strong>
            </li>
            <li>
              <span>Órdenes pendientes &gt; 7 días</span>
              <strong>{NUMBER_FORMATTER.format(orderInsights.overdueOrders)}</strong>
            </li>
            <li>
              <span>Última orden</span>
              <strong>
                {orderInsights.lastOrder
                  ? orderInsights.lastOrder.toLocaleDateString("es-CL")
                  : "Sin registros"}
              </strong>
            </li>
          </ul>
          <footer>
            <h4>Estado de órdenes</h4>
            <ol>
              {orderInsights.statusList.map(({ status, count }) => (
                <li key={status}>
                  <span>{status}</span>
                  <span>{NUMBER_FORMATTER.format(count)}</span>
                </li>
              ))}
              {orderInsights.statusList.length === 0 && <li>No hay datos de estado</li>}
            </ol>
          </footer>
        </section>
      </div>

      <div className="admin-reports__tables">
        <section>
          <header>
            <h3>Clientes destacados</h3>
            <span>Top 5 por ingresos generados</span>
          </header>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Órdenes</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.length === 0 && (
                <tr>
                  <td colSpan={3} className="admin-table__empty">
                    No hay clientes registrados en el histórico.
                  </td>
                </tr>
              )}
              {topCustomers.map((customer) => (
                <tr key={customer.email}>
                  <td>
                    <strong>{customer.name}</strong>
                    <br />
                    <span className="admin-reports__muted">{customer.email}</span>
                  </td>
                  <td>{NUMBER_FORMATTER.format(customer.orders)}</td>
                  <td>{CURRENCY_FORMATTER.format(customer.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <header>
            <h3>Productos más vendidos</h3>
            <span>Top 5 por ingresos</span>
          </header>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan={3} className="admin-table__empty">
                    No hay historial de ventas disponible.
                  </td>
                </tr>
              )}
              {topProducts.map((product) => (
                <tr key={product.productId}>
                  <td>{product.name}</td>
                  <td>{NUMBER_FORMATTER.format(product.quantity)}</td>
                  <td>{CURRENCY_FORMATTER.format(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <header>
            <h3>Stock crítico</h3>
            <span>Productos con poca disponibilidad</span>
          </header>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock</th>
                <th>Stock base</th>
              </tr>
            </thead>
            <tbody>
              {productInsights.lowStock.length === 0 && (
                <tr>
                  <td colSpan={3} className="admin-table__empty">
                    No hay alertas de stock actualmente.
                  </td>
                </tr>
              )}
              {productInsights.lowStock.map((product) => (
                <tr key={product.id}>
                  <td>{product.nombre}</td>
                  <td>{NUMBER_FORMATTER.format(product.stock)}</td>
                  <td>{NUMBER_FORMATTER.format(product.stockBase ?? product.stock)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </section>
  );
};

export default AdminReports;
