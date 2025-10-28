import { useCallback, useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard.jsx";
import QuickLinks from "@/components/dashboard/QuickLinks.jsx";
import {
  getAllOrders,
  subscribeToOrderChanges,
  ORDER_STORAGE_KEY,
} from "@/services/orderService.js";
import {
  getAllProducts,
  subscribeToProductChanges,
  PRODUCT_STORAGE_KEY,
} from "@/services/productService.js";
import {
  getAllUsers,
  subscribeToUserChanges,
  USER_STORAGE_KEY,
  REGISTERED_USER_STORAGE_KEY,
} from "@/services/userService.js";

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

const computeDashboardMetrics = () => {
  const now = Date.now();

  const orders = getAllOrders();
  const totalOrders = orders.length;

  const ordersLast30 = orders.filter(({ createdAt }) => {
    const createdAtMs = new Date(createdAt).getTime();
    return Number.isFinite(createdAtMs) && now - createdAtMs <= THIRTY_DAYS_MS;
  }).length;
  const ordersPrev30 = orders.filter(({ createdAt }) => {
    const createdAtMs = new Date(createdAt).getTime();
    if (!Number.isFinite(createdAtMs)) return false;
    const diff = now - createdAtMs;
    return diff > THIRTY_DAYS_MS && diff <= THIRTY_DAYS_MS * 2;
  }).length;

  const growthRate =
    ordersPrev30 === 0 ? 1 : (ordersLast30 - ordersPrev30) / Math.max(ordersPrev30, 1);
  const growthProbability = Math.round(Math.max(0, Math.min(100, 50 + growthRate * 100)));
  const ordersTrendVariant = ordersLast30 >= ordersPrev30 ? "positive" : "negative";

  const productList = getAllProducts();
  const inventoryTotalUnits = productList.reduce(
    (acc, product) => acc + (Number(product?.stock) || 0),
    0,
  );
  const inventoryCapacity = productList.reduce((acc, product) => {
    const base = Number(product?.stockBase ?? product?.stock ?? 0);
    return acc + base + INVENTORY_CAPACITY_BUFFER;
  }, 0);

  const users = getAllUsers();
  const totalUsers = users.length;
  const newUsersLast30 = users.filter(({ registeredAt }) => {
    const registeredAtMs = new Date(registeredAt).getTime();
    return Number.isFinite(registeredAtMs) && now - registeredAtMs <= THIRTY_DAYS_MS;
  }).length;
  const newUsersRatio =
    totalUsers === 0 ? 0 : Math.round((newUsersLast30 / Math.max(totalUsers, 1)) * 100);
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
      value: formatNumber(productList.length),
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

  return { orderStats, inventoryStats, userStats };
};

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(() => computeDashboardMetrics());
  const quickLinks = QUICK_LINKS;

  const refreshMetrics = useCallback(() => {
    setMetrics(computeDashboardMetrics());
  }, []);

  useEffect(() => {
    const unsubscribeProducts = subscribeToProductChanges(refreshMetrics);
    const unsubscribeUsers = subscribeToUserChanges(refreshMetrics);
    const unsubscribeOrders = subscribeToOrderChanges(refreshMetrics);

    if (typeof window === "undefined") {
      return () => {
        unsubscribeProducts?.();
        unsubscribeUsers?.();
        unsubscribeOrders?.();
      };
    }

    const watchedKeys = new Set([
      PRODUCT_STORAGE_KEY,
      USER_STORAGE_KEY,
      REGISTERED_USER_STORAGE_KEY,
      ORDER_STORAGE_KEY,
      null,
    ]);

    const handleStorage = (event) => {
      if (watchedKeys.has(event.key)) {
        refreshMetrics();
      }
    };

    window.addEventListener("storage", handleStorage);
    refreshMetrics();

    return () => {
      unsubscribeProducts?.();
      unsubscribeUsers?.();
      unsubscribeOrders?.();
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshMetrics]);

  const { orderStats, inventoryStats, userStats } = metrics;

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
