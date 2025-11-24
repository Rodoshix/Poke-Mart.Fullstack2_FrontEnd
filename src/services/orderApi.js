import { apiFetch } from "@/services/httpClient.js";

const mapOrderItem = (item = {}) => ({
  id: item.productoId ?? item.id,
  sku: String(item.productoId ?? item.id ?? ""),
  name: item.nombreProducto ?? item.name ?? "Producto",
  quantity: Number(item.cantidad ?? item.quantity ?? 0),
  unitPrice: Number(item.precioUnitario ?? item.unitPrice ?? 0),
  total: Number(item.totalLinea ?? item.total ?? 0),
});

const mapOrderResponse = (order = {}) => {
  const estado = typeof order.estado === "string" ? order.estado.toLowerCase() : order.estado;
  const items = Array.isArray(order.items) ? order.items.map(mapOrderItem) : [];
  const usedOffers = Boolean(order.ofertasAplicadas);
  return {
    id: order.numeroOrden ?? order.id,
    backendId: order.id,
    createdAt: order.creadoEn ?? order.createdAt,
    updatedAt: order.actualizadoEn ?? order.updatedAt,
    customer: order.nombreCliente ?? "Cliente",
    customerEmail: order.correoCliente ?? "",
    customerPhone: order.telefonoCliente ?? "",
    status: estado ?? order.status ?? "creada",
    total: Number(order.total ?? 0),
    summary: {
      subtotal: Number(order.subtotal ?? 0),
      shipping: Number(order.costoEnvio ?? order.shipping ?? 0),
      discount: Number(order.descuento ?? order.discount ?? 0),
      taxes: Number(order.impuestos ?? order.taxes ?? 0),
      total: Number(order.total ?? 0),
      usedOffers,
    },
    payment: {
      method: order.metodoPago ?? "Pago en linea",
      status: order.estado ?? "procesando",
      transactionId: order.numeroOrden ?? order.id ?? undefined,
      capturedAt: order.actualizadoEn ?? order.creadoEn ?? null,
    },
    shipping: {
      method: "Despacho a domicilio",
      carrier: "Pendiente",
      cost: Number(order.costoEnvio ?? 0),
      address: {
        street: order.direccionEnvio,
        region: order.regionEnvio,
        city: order.comunaEnvio,
        reference: order.referenciaEnvio,
        country: "Chile",
      },
    },
    notes: order.notas,
    currency: "CLP",
    items,
    usedOffers,
  };
};

export async function createOrder(payload, { auth = true } = {}) {
  const data = await apiFetch("/api/orders", {
    method: "POST",
    body: payload,
    auth,
  });
  return mapOrderResponse(data);
}

export async function fetchAdminOrders() {
  const data = await apiFetch("/api/admin/orders", { auth: true });
  if (!Array.isArray(data)) return [];
  return data.map(mapOrderResponse);
}

export async function updateAdminOrder(id, payload) {
  const data = await apiFetch(`/api/admin/orders/${id}`, {
    method: "PATCH",
    auth: true,
    body: {
      estado: payload.estado,
      notas: payload.notas,
      referenciaEnvio: payload.referenciaEnvio,
    },
  });
  return mapOrderResponse(data);
}

export { mapOrderResponse };
