const computeStatus = (stock, stockBase) => {
  const base = Number(stockBase) || 0;
  const current = Number(stock) || 0;
  if (base <= 0) {
    return { status: "sin-datos", label: "Sin datos" };
  }
  const ratio = current / base;
  if (ratio <= 0.1) {
    return { status: "critico", label: "Stock crítico" };
  }
  if (ratio <= 0.3) {
    return { status: "bajo", label: "Stock bajo" };
  }
  if (ratio >= 1.2) {
    return { status: "sobrante", label: "Stock alto" };
  }
  return { status: "saludable", label: "Stock saludable" };
};

const StockBadge = ({ stock, stockBase }) => {
  const { status, label } = computeStatus(stock, stockBase);
  return <span className={`admin-stock-badge admin-stock-badge--${status}`}>{label}</span>;
};

export const getStockStatus = computeStatus;

export default StockBadge;
