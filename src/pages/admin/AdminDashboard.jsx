import { useMemo } from "react";
import StatCard from "@/components/dashboard/StatCard.jsx";
import QuickLinks from "@/components/dashboard/QuickLinks.jsx";
import useOrdersData from "@/hooks/useOrdersData.js";
import useAdminProducts from "@/hooks/useAdminProducts.js";
import useUsersData from "@/hooks/useUsersData.js";

const THIRTY_DAYS_MS = 30 * 86_400_000;
const INVENTORY_CAPACITY_BUFFER = 80;
const formatNumber = (value) => Number(value ?? 0).toLocaleString("es-CL");

const QUICK_LINKS = [
  { id: "dashboard", to: "/admin", title: "Dashboard", description: "Resumen general", icon: "DB" },
  { id: "orders", to: "/admin/ordenes", title: "Órdenes", description: "Gestiona ventas", icon: "OR" },
  { id: "products", to: "/admin/productos", title: "Productos", description: "Actualiza stock", icon: "PR" },
  { id: "categories", to: "/admin/categorias", title: "Categorías", description: "Organiza catálogos", icon: "CT" },
  { id: "users", to: "/admin/usuarios", title: "Usuarios", description: "Administra clientes", icon: "US" },
  { id: "reports", to: "/admin/reportes", title: "Reportes", description: "Analiza métricas", icon: "RP" },
  { id: "profile", to: "/admin/perfil", title: "Perfil", description: "Actualiza tu cuenta", icon: "PF" },
  { id: "store", to: "/", title: "Tienda", description: "Ver vitrina online", icon: "ST" },
];

const AdminDashboard = () => {
  const orders = useOrdersData();
  const products = useAdminProducts();
  const users = useUsersData();
  const quickLinks = QUICK_LINKS;
  const anyLoading = orders?.loading || products?.loading || users?.loading;
  const firstError = orders?.error || products?.error || users?.error;

  const metrics = useMemo(() => {
    if (anyLoading) return null;
    const now = Date.now();
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeProducts = Array.isArray(products) ? products : [];
    const safeUsers = Array.isArray(users) ? users : [];

    const ordersLast30 = safeOrders.filter(({ createdAt }) => {
      const t = new Date(createdAt).getTime();
      return Number.isFinite(t) && now - t <= THIRTY_DAYS_MS;
    }).length;
    const ordersPrev30 = safeOrders.filter(({ createdAt }) => {
      const t = new Date(createdAt).getTime();
      if (!Number.isFinite(t)) return false;
      const diff = now - t;
      return diff > THIRTY_DAYS_MS && diff <= THIRTY_DAYS_MS * 2;
    }).length;
    const growthRate =
      ordersPrev30 === 0 ? 1 : (ordersLast30 - ordersPrev30) / Math.max(ordersPrev30, 1);
    const growthProbability = Math.round(Math.max(0, Math.min(100, 50 + growthRate * 100)));
    const ordersTrendVariant = ordersLast30 >= ordersPrev30 ? "positive" : "negative";

    const inventoryTotalUnits = safeProducts.reduce(
      (acc, product) => acc + (Number(product?.stock) || 0),
      0,
    );
    const inventoryCapacity = safeProducts.reduce((acc, product) => {
      const base = Number(product?.stockBase ?? product?.stock ?? 0);
      return acc + base + INVENTORY_CAPACITY_BUFFER;
    }, 0);

    const newUsersLast30 = safeUsers.filter(({ registeredAt }) => {
      const t = new Date(registeredAt).getTime();
      return Number.isFinite(t) && now - t <= THIRTY_DAYS_MS;
    }).length;
    const newUsersRatio =
      safeUsers.length === 0 ? 0 : Math.round((newUsersLast30 / Math.max(safeUsers.length, 1)) * 100);
    const userTrendVariant = newUsersLast30 > 0 ? "positive" : "neutral";

    const orderStats = {
      title: "Compras del sitio",
      icon: "ORD",
      primaryValue: formatNumber(safeOrders.length),
      primaryLabel: "Órdenes totales",
      secondaryLabel: "Probabilidad de aumento",
      secondaryValue: `${growthProbability}%`,
      trend: {
        label: "Órdenes últimos 30 días",
        value: formatNumber(ordersLast30),
        variant: ordersTrendVariant,
      },
      tone: "primary",
    };

    const inventoryStats = {
      title: "Inventario disponible",
      icon: "INV",
      primaryValue: formatNumber(inventoryTotalUnits),
      primaryLabel: "Unidades en stock",
      secondaryLabel: "Capacidad máxima",
      secondaryValue: formatNumber(inventoryCapacity),
      trend: {
        label: "SKUs activos",
        value: formatNumber(safeProducts.length),
        variant: "neutral",
      },
      tone: "accent",
    };

    const userStats = {
      title: "Usuarios registrados",
      icon: "USR",
      primaryValue: formatNumber(safeUsers.length),
      primaryLabel: "Usuarios totales",
      secondaryLabel: "Altas últimos 30 días",
      secondaryValue: formatNumber(newUsersLast30),
      trend: {
        label: "Participación reciente",
        value: `${newUsersRatio}% del total`,
        variant: userTrendVariant,
      },
      tone: "neutral",
    };

    return { orderStats, inventoryStats, userStats };
  }, [orders, products, users, anyLoading]);

  const { orderStats, inventoryStats, userStats } = metrics || {};

  return (
    <section className="admin-paper admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">
          Bienvenido nuevamente al panel administrador. Aquí verás las métricas principales y enlaces rápidos para tu
          gestión diaria.
        </p>
      </div>

      {anyLoading && (
        <div className="admin-products__alert" role="status">
          Cargando métricas...
        </div>
      )}
      {firstError && (
        <div className="admin-products__alert admin-products__alert--error" role="alert">
          {firstError}
        </div>
      )}

      {metrics && (
        <div className="admin-dashboard__metrics">
          <StatCard {...orderStats} />
          <StatCard {...inventoryStats} />
          <StatCard {...userStats} />
        </div>
      )}

      <div className="admin-dashboard__quick-links">
        <div className="admin-dashboard__quick-links-header">
          <h2 className="admin-dashboard__quick-links-title">Accesos rápidos</h2>
          <p className="admin-dashboard__quick-links-subtitle">Navega a las vistas clave del panel con un solo clic.</p>
        </div>
        <QuickLinks links={quickLinks} />
      </div>
    </section>
  );
};

export default AdminDashboard;
