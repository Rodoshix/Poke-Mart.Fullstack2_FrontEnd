const STATUS_MAP = {
  completed: { label: "Completada", variant: "success" },
  processing: { label: "En proceso", variant: "warning" },
  pending: { label: "Pendiente", variant: "warning" },
  "pendiente de envío": { label: "Pendiente de Envío", variant: "warning" },
  "ready_to_ship": { label: "Pendiente de Envío", variant: "warning" },
  cancelled: { label: "Cancelada", variant: "danger" },
  refunded: { label: "Reembolsada", variant: "neutral" },
};

const normalize = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const OrderBadge = ({ status }) => {
  const normalized = normalize(status);
  const { label, variant } = STATUS_MAP[normalized] ?? {
    label: status || "Desconocido",
    variant: "neutral",
  };

  return <span className={`admin-order-badge admin-order-badge--${variant}`}>{label}</span>;
};

export default OrderBadge;
