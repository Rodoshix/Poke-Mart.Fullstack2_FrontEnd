import { useMemo, useState } from "react";
import useProductsData from "@/hooks/useProductsData.js";
import ReportFilters from "@/components/productReports/ReportFilters.jsx";
import ReportResults from "@/components/productReports/ReportResults.jsx";
import { getStockStatus } from "@/components/products/StockBadge.jsx";

const AdminProductsReports = () => {
  const products = useProductsData();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => {
    const set = new Set(
      (products ?? [])
        .map((item) => (item?.categoria ?? "").toString().trim())
        .filter(Boolean),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  const enriched = useMemo(() => {
    return (products ?? []).map((product) => {
      const stock = Number(product.stock ?? 0);
      const stockBase =
        Number(product.stockBase ?? product.stock ?? 0) > 0
          ? Number(product.stockBase ?? product.stock ?? 0)
          : stock;
      const ratio = stockBase > 0 ? stock / stockBase : 1;
      const inventoryValue = stock * Number(product.precio ?? 0);
      const statusInfo = getStockStatus(stock, stockBase);
      return {
        ...product,
        stock,
        stockBase,
        ratio,
        inventoryValue,
        statusInfo,
      };
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return enriched.filter((product) => {
      const matchesCategory = selectedCategory ? product.categoria === selectedCategory : true;
      const matchesStatus =
        selectedStatus === "all"
          ? true
          : selectedStatus === "critical"
            ? product.ratio <= 0.1
            : selectedStatus === "low"
              ? product.ratio > 0.1 && product.ratio <= 0.3
              : product.ratio > 0.3;
      const matchesSearch =
        !term ||
        product.nombre.toLowerCase().includes(term) ||
        String(product.id).includes(term) ||
        product.categoria.toLowerCase().includes(term);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [enriched, selectedCategory, selectedStatus, searchTerm]);

  const summary = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const totalCategories = new Set(filteredProducts.map((p) => p.categoria)).size;
    const totalStock = filteredProducts.reduce((acc, product) => acc + product.stock, 0);
    const totalStockValue = filteredProducts.reduce(
      (acc, product) => acc + product.inventoryValue,
      0,
    );
    const totalAtRisk = filteredProducts.filter((product) => product.ratio <= 0.3).length;
    const totalCritical = filteredProducts.filter((product) => product.ratio <= 0.1).length;

    return { totalProducts, totalCategories, totalStock, totalStockValue, totalAtRisk, totalCritical };
  }, [filteredProducts]);

  const categoryStats = useMemo(() => {
    const map = new Map();
    filteredProducts.forEach((product) => {
      const key = product.categoria || "Sin categoría";
      const entry =
        map.get(key) ??
        {
          name: key,
          products: 0,
          stock: 0,
          stockBase: 0,
          inventoryValue: 0,
          priceSum: 0,
        };
      entry.products += 1;
      entry.stock += product.stock;
      entry.stockBase += product.stockBase;
      entry.inventoryValue += product.inventoryValue;
      entry.priceSum += Number(product.precio ?? 0);
      map.set(key, entry);
    });

    return Array.from(map.values())
      .map((entry) => ({
        ...entry,
        averagePrice: entry.products > 0 ? entry.priceSum / entry.products : 0,
      }))
      .sort((a, b) => b.inventoryValue - a.inventoryValue);
  }, [filteredProducts]);

  const atRisk = useMemo(() => {
    return filteredProducts
      .filter((product) => product.ratio <= 0.3)
      .sort((a, b) => a.ratio - b.ratio)
      .slice(0, 6);
  }, [filteredProducts]);

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedStatus("all");
    setSearchTerm("");
  };

  return (
    <section className="admin-paper admin-product-reports">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reportes de productos</h1>
        <p className="admin-page-subtitle">
          Analiza el estado actual del catálogo para tomar decisiones informadas sobre reposición y precios.
        </p>
      </div>

      <ReportFilters
        categories={categories}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        searchTerm={searchTerm}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
        onSearchChange={setSearchTerm}
        onReset={
          selectedCategory || selectedStatus !== "all" || searchTerm ? handleResetFilters : undefined
        }
      />

      <ReportResults
        summary={summary}
        categoryStats={categoryStats}
        atRisk={atRisk}
        filteredProducts={filteredProducts}
      />
    </section>
  );
};

export default AdminProductsReports;
