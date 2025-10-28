import { useMemo, useState } from "react";
import OrderFilters from "@/components/orders/OrderFilters.jsx";
import OrderTable from "@/components/orders/OrderTable.jsx";
import useOrdersData from "@/hooks/useOrdersData.js";

const DEFAULT_SORT = "createdAt:desc";

const parseSortOption = (option) => {
  const [key, direction] = (option || DEFAULT_SORT).split(":");
  return {
    key: key === "total" ? "total" : "createdAt",
    direction: direction === "asc" ? "asc" : "desc",
  };
};

const sortOrders = (orders, option) => {
  const { key, direction } = parseSortOption(option);
  const multiplier = direction === "asc" ? 1 : -1;

  return [...orders].sort((a, b) => {
    if (key === "total") {
      return (Number(a.total) - Number(b.total)) * multiplier;
    }

    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return (dateA - dateB) * multiplier;
  });
};

const filterOrders = (orders, searchTerm) => {
  const query = (searchTerm || "").trim().toLowerCase();
  if (!query) return orders;

  return orders.filter((order) => order.id?.toLowerCase().includes(query));
};

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);

  const ordersDataset = useOrdersData();

  const filteredAndSortedOrders = useMemo(() => {
    const base = Array.isArray(ordersDataset) ? ordersDataset : [];
    const filtered = filterOrders(base, searchTerm);
    return sortOrders(filtered, sortOption);
  }, [ordersDataset, searchTerm, sortOption]);

  return (
    <section className="admin-paper admin-orders">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Órdenes</h1>
        <p className="admin-page-subtitle">
          Revisa el histórico de compras de la tienda, identifica a los clientes y accede al detalle completo de cada
          boleta.
        </p>
      </div>

      <OrderFilters
        searchTerm={searchTerm}
        sortOption={sortOption}
        onSearchChange={setSearchTerm}
        onSortChange={setSortOption}
      />

      <div className="admin-orders__meta">
        Mostrando {filteredAndSortedOrders.length} de {Array.isArray(ordersDataset) ? ordersDataset.length : 0} órdenes registradas.
      </div>

      <OrderTable orders={filteredAndSortedOrders} />
    </section>
  );
};

export default AdminOrders;
