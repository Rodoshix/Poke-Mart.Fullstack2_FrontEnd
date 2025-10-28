import { seedOrders } from "@/data/seedOrders.js";

const ORDER_STORAGE_KEY = "pokemart.admin.orders";
const ORDERS_EVENT = "orders-data-changed";
const TAX_RATE = 0.19;

const coerceString = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  const str = String(value);
  return str.trim ? str.trim() : str;
};

const coerceNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeAddress = (address = {}) => ({
  street: coerceString(address.street),
  city: coerceString(address.city),
  region: coerceString(address.region),
  reference: coerceString(address.reference),
  zipCode: coerceString(address.zipCode),
  country: coerceString(address.country || "Chile"),
});

const normalizeOrderItems = (items = []) =>
  items
    .map((item) => {
      const quantity = Math.max(1, coerceNumber(item?.quantity ?? item?.qty, 1));
      const unitPrice = Math.max(0, coerceNumber(item?.unitPrice ?? item?.price, 0));
      const productIdCandidate =
        item?.productId ?? item?.id ?? item?.sku ?? item?.product?.id ?? null;
      const productId = Number(productIdCandidate);
      return {
        productId: Number.isFinite(productId) ? productId : undefined,
        sku: coerceString(item?.sku ?? productIdCandidate ?? ""),
        name: coerceString(item?.name ?? item?.title ?? `Producto ${productIdCandidate ?? ""}`),
        quantity,
        unitPrice,
      };
    })
    .filter((item) => item.quantity > 0);

const normalizeStatusHistory = (history, createdAt, updatedAt, status) => {
  if (!Array.isArray(history) || history.length === 0) {
    return [
      { status: "created", label: "Orden creada", timestamp: createdAt },
      { status: "completed", label: "Pago confirmado", timestamp: updatedAt },
    ];
  }
  return history
    .map((entry) => ({
      status: coerceString(entry.status || "created"),
      label: coerceString(entry.label || entry.status || "Actualización"),
      timestamp: entry.timestamp ?? createdAt,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

const mapOrder = (order) => {
  if (!order) return null;

  const createdAt = order.createdAt ?? new Date().toISOString();
  const updatedAt = order.updatedAt ?? createdAt;
  const items = normalizeOrderItems(order.items);

  const subtotal =
    order.summary?.subtotal ??
    items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const shippingCost =
    order.summary?.shipping ?? coerceNumber(order.shipping?.cost, 0);
  const discount = coerceNumber(order.summary?.discount, 0);
  const total =
    order.summary?.total ??
    coerceNumber(order.total, subtotal + shippingCost - discount);
  const taxes =
    order.summary?.taxes ??
    Math.max(0, Math.round(total - total / (1 + TAX_RATE)));

  const status = coerceString(order.status || "completed");

  return {
    id: coerceString(order.id || `ORD-${Date.now()}`),
    customerId: Number.isFinite(Number(order.customerId))
      ? Number(order.customerId)
      : undefined,
    customer: coerceString(order.customer || order.customerName || "Cliente tienda"),
    customerEmail: coerceString(order.customerEmail || order.email),
    customerPhone: coerceString(order.customerPhone || order.phone),
    status,
    currency: coerceString(order.currency || "CLP"),
    createdAt,
    updatedAt,
    items,
    payment: {
      method: coerceString(order.payment?.method || "Pago en línea"),
      status: coerceString(order.payment?.status || "Pagado"),
      transactionId: coerceString(order.payment?.transactionId),
      capturedAt: order.payment?.capturedAt ?? updatedAt,
    },
    shipping: {
      method: coerceString(
        order.shipping?.method ||
          (shippingCost > 0 ? "Despacho estándar" : "Retiro en tienda"),
      ),
      carrier: coerceString(
        order.shipping?.carrier ||
          (shippingCost > 0 ? "Poké Express" : "Retiro en tienda"),
      ),
      cost: shippingCost,
      trackingNumber: coerceString(order.shipping?.trackingNumber),
      estimatedDelivery: order.shipping?.estimatedDelivery ?? null,
      address: normalizeAddress(order.shipping?.address),
    },
    summary: {
      subtotal,
      shipping: shippingCost,
      discount,
      taxes,
      total,
    },
    total,
    statusHistory: normalizeStatusHistory(
      order.statusHistory,
      createdAt,
      updatedAt,
      status,
    ),
    notes: coerceString(order.notes),
  };
};

const baseOrders = Array.isArray(seedOrders)
  ? seedOrders.map((order) => mapOrder(order)).filter(Boolean)
  : [];

const emitChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ORDERS_EVENT));
  }
};

const readOverrides = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return { added: [], updated: {} };
  }

  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return { added: [], updated: {} };
    const parsed = JSON.parse(raw);
    const added = Array.isArray(parsed?.added)
      ? parsed.added.map((order) => mapOrder(order)).filter(Boolean)
      : [];
    const updatedEntries =
      parsed?.updated && typeof parsed.updated === "object"
        ? Object.fromEntries(
            Object.entries(parsed.updated).map(([key, value]) => [
              key,
              mapOrder({ ...value, id: key }),
            ]),
          )
        : {};

    return { added, updated: updatedEntries };
  } catch {
    return { added: [], updated: {} };
  }
};

const writeOverrides = (overrides) => {
  if (typeof window === "undefined" || !window.localStorage) return;

  const payload = {
    added: (overrides.added ?? []).map((order) => mapOrder(order)),
    updated: Object.fromEntries(
      Object.entries(overrides.updated ?? {}).map(([key, value]) => [
        key,
        mapOrder({ ...value, id: key }),
      ]),
    ),
  };

  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(payload));
  emitChange();
};

const mergeOrders = () => {
  const overrides = readOverrides();
  const mergedBase = baseOrders.map((order) => {
    const override = overrides.updated?.[order.id];
    return override ? mapOrder({ ...order, ...override, id: order.id }) : order;
  });
  return [...mergedBase, ...(overrides.added ?? [])];
};

const getAllOrders = () => mergeOrders();

const getOrderById = (orderId) => {
  const id = coerceString(orderId);
  return getAllOrders().find((order) => coerceString(order.id) === id) ?? null;
};

const parseOrderNumber = (orderId) => {
  const match = /^ORD-(\d+)$/.exec(coerceString(orderId));
  return match ? Number(match[1]) : null;
};

const getNextOrderId = () => {
  const all = getAllOrders();
  let max = 0;
  all.forEach((order) => {
    const number = parseOrderNumber(order.id);
    if (Number.isFinite(number) && number > max) {
      max = number;
    }
  });

  const nextNumber = max > 0 ? max + 1 : 1001;
  return `ORD-${String(nextNumber).padStart(4, "0")}`;
};

const createOrder = (orderData = {}) => {
  const overrides = readOverrides();
  const orderId = orderData.id ?? getNextOrderId();
  const timestamp = new Date().toISOString();

  const normalized = mapOrder({
    ...orderData,
    id: orderId,
    createdAt: orderData.createdAt ?? timestamp,
    updatedAt: orderData.updatedAt ?? timestamp,
  });

  const added = overrides.added ?? [];
  const filtered = added.filter((order) => coerceString(order.id) !== normalized.id);
  filtered.push(normalized);

  overrides.added = filtered;
  if (overrides.updated) {
    delete overrides.updated[normalized.id];
  }

  writeOverrides(overrides);
  return normalized;
};

const subscribeToOrderChanges = (callback) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback?.();
  window.addEventListener(ORDERS_EVENT, handler);
  return () => window.removeEventListener(ORDERS_EVENT, handler);
};

const resetOrders = () => {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.removeItem(ORDER_STORAGE_KEY);
  emitChange();
};

export {
  getAllOrders,
  getOrderById,
  getNextOrderId,
  createOrder,
  subscribeToOrderChanges,
  resetOrders,
  ORDER_STORAGE_KEY,
  ORDERS_EVENT,
};
