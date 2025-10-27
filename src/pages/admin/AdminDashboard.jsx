import { useMemo } from "react";
import StatCard from "@/components/dashboard/StatCard.jsx";
import QuickLinks from "@/components/dashboard/QuickLinks.jsx";
import { seedOrders } from "@/data/seedOrders.js";
import { seedUsers } from "@/data/seedUsers.js";
import { seedProducts, totalAvailableStock, totalInventoryCapacity } from "@/data/seedProducts.js";

const THIRTY_DAYS_MS = 30 * 86_400_000;
const formatNumber = (value) => Number(value ?? 0).toLocaleString("es-CL");

const AdminDashboard = () => {
  const { orderStats, inventoryStats, userStats, quickLinks } = useMemo(() => {
    const now = Date.now();

    const orders = Array.isArray(seedOrders) ? seedOrders : [];
    const totalOrders = orders.length;

    const ordersLast30 = orders.filter(({ createdAt }) => now - new Date(createdAt).getTime() <= THIRTY_DAYS_MS).length;
    const ordersPrev30 = orders.filter(({ createdAt }) => {
      const diff = now - new Date(createdAt).getTime();
      return diff > THIRTY_DAYS_MS && diff <= THIRTY_DAYS_MS * 2;
    }).length;

    const growthRate = ordersPrev30 === 0 ? 1 : (ordersLast30 - ordersPrev30) / Math.max(ordersPrev30, 1);
    const growthProbability = Math.round(Math.max(0, Math.min(100, 50 + growthRate * 100)));
    const ordersTrendVariant = ordersLast30 >= ordersPrev30 ? "positive" : "negative";

    const inventoryTotalUnits = totalAvailableStock ?? 0;
    const inventoryCapacity = totalInventoryCapacity ?? inventoryTotalUnits;

    const users = Array.isArray(seedUsers) ? seedUsers : [];
    const totalUsers = users.length;
    const newUsersLast30 = users.filter(({ registeredAt }) => now - new Date(registeredAt).getTime() <= THIRTY_DAYS_MS).length;
    const newUsersRatio = totalUsers === 0 ? 0 : Math.round((newUsersLast30 / totalUsers) * 100);
    const userTrendVariant = newUsersLast30 > 0 ? "positive" : "neutral";

    const orderStats = {
      title: "Compras del sitio",
      icon: "ORD",
      primaryValue: formatNumber(totalOrders),
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
        value: formatNumber(seedProducts.length),
        variant: "neutral",
      },
      tone: "accent",
    };

    const userStats = {
      title: "Usuarios registrados",
      icon: "USR",
      primaryValue: formatNumber(totalUsers),
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

    const quickLinks = [
      { id: "dashboard", to: "/admin", title: "Dashboard", description: "Resumen general", icon: "DB" },
      { id: "orders", to: "/admin/ordenes", title: "Órdenes", description: "Gestiona ventas", icon: "OR" },
      { id: "products", to: "/admin/productos", title: "Productos", description: "Actualiza stock", icon: "PR" },
      { id: "categories", to: "/admin/categorias", title: "Categorías", description: "Organiza catálogos", icon: "CT" },
      { id: "users", to: "/admin/usuarios", title: "Usuarios", description: "Administra clientes", icon: "US" },
      { id: "reports", to: "/admin/reportes", title: "Reportes", description: "Analiza métricas", icon: "RP" },
      { id: "profile", to: "/admin/perfil", title: "Perfil", description: "Actualiza tu cuenta", icon: "PF" },
      { id: "store", to: "/", title: "Tienda", description: "Ver vitrina online", icon: "ST" },
    ];

    return { orderStats, inventoryStats, userStats, quickLinks };
  }, []);

  return (
    <section className="admin-paper admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">
          Bienvenido nuevamente al panel administrador. Aquí verás las métricas principales y enlaces rápidos para tu
          gestión diaria.
        </p>
      </div>

      <div className="admin-dashboard__metrics">
        <StatCard {...orderStats} />
        <StatCard {...inventoryStats} />
        <StatCard {...userStats} />
      </div>

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
