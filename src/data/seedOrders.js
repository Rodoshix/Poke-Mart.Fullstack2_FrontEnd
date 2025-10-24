import catalogoProductos from "@/data/productos.json";

const createOrderDate = (daysAgo, hoursOffset = 0) =>
  new Date(Date.now() - daysAgo * 86_400_000 + hoursOffset * 3_600_000).toISOString();

const addMinutes = (isoString, minutes) =>
  new Date(new Date(isoString).getTime() + minutes * 60_000).toISOString();

const calculateSubtotal = (items = []) =>
  items.reduce((acc, item) => acc + (item.unitPrice ?? 0) * (item.quantity ?? 0), 0);

const TAX_RATE = 0.19;

const defaultShipping = {
  method: "Despacho estándar",
  cost: 2990,
  carrier: "Pidgey Express",
  trackingNumber: null,
  estimatedDelivery: null,
  address: {
    street: "",
    city: "",
    region: "",
    reference: "",
    zipCode: "",
    country: "Chile",
  },
};

const defaultPayment = {
  method: "Tarjeta de crédito",
  status: "Pagado",
  transactionId: "",
  capturedAt: "",
};

const productMap = new Map(catalogoProductos.map((producto) => [producto.id, producto]));

const resolveProduct = (productId) => productMap.get(productId);

const createOrderItems = (definitions = []) =>
  definitions.map(({ productId, quantity }) => {
    const product = resolveProduct(productId);
    const unitPrice = Number(product?.precio) || 0;

    return {
      productId,
      sku: String(productId),
      name: product?.nombre ?? `Producto ${productId}`,
      quantity,
      unitPrice,
    };
  });

const createOrderRecord = (config) => {
  const items = config.items ?? [];
  const subtotal = Math.round(config.summary?.subtotal ?? calculateSubtotal(items));
  const shippingCost =
    config.summary?.shipping ?? (config.shipping && typeof config.shipping.cost === "number"
      ? config.shipping.cost
      : defaultShipping.cost);
  const discount = Math.round(config.summary?.discount ?? 0);
  const total = Math.round(config.summary?.total ?? config.total ?? subtotal + shippingCost - discount);
  const taxRate = config.summary?.taxRate ?? TAX_RATE;
  const taxes = Math.round(config.summary?.taxes ?? Math.max(0, (total * taxRate) / (1 + taxRate)));
  const createdAt = config.createdAt;
  const statusHistory = (config.statusHistory ??
    [
      { status: "created", label: "Orden creada", timestamp: createdAt },
      { status: "processing", label: "Pago confirmado", timestamp: addMinutes(createdAt, 55) },
      { status: "completed", label: "Pedido entregado", timestamp: addMinutes(createdAt, 4320) },
    ]).slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const updatedAt =
    config.updatedAt ??
    (statusHistory.length > 0 ? statusHistory[statusHistory.length - 1].timestamp : createdAt);

  return {
    id: config.id,
    customerId: config.customerId,
    customer: config.customer,
    customerEmail: config.customerEmail,
    customerPhone: config.customerPhone,
    status: config.status ?? "completed",
    currency: "CLP",
    createdAt,
    updatedAt,
    items,
    payment: {
      ...defaultPayment,
      ...config.payment,
    },
    shipping: {
      ...defaultShipping,
      ...config.shipping,
      cost: shippingCost,
      address: {
        ...defaultShipping.address,
        ...(config.shipping?.address ?? {}),
      },
    },
    summary: {
      subtotal,
      shipping: shippingCost,
      taxes,
      discount,
      total,
    },
    total,
    statusHistory,
    notes: config.notes ?? "",
  };
};

const order1021CreatedAt = createOrderDate(2, 9);
const order1020CreatedAt = createOrderDate(4, 11);
const order1019CreatedAt = createOrderDate(6, 15);
const order1018CreatedAt = createOrderDate(8, 14);
const order1017CreatedAt = createOrderDate(10, 17);
const order1016CreatedAt = createOrderDate(12, 10);
const order1015CreatedAt = createOrderDate(15, 16);
const order1014CreatedAt = createOrderDate(18, 18);
const order1013CreatedAt = createOrderDate(21, 12);
const order1012CreatedAt = createOrderDate(25, 9);

const seedOrders = [
  createOrderRecord({
    id: "ORD-1021",
    customerId: 2,
    customer: "Ash Ketchum",
    customerEmail: "ash@gmail.com",
    customerPhone: "+56 9 1111 2222",
    status: "completed",
    createdAt: order1021CreatedAt,
    payment: {
      transactionId: "PAY-8945221",
      capturedAt: addMinutes(order1021CreatedAt, 42),
    },
    shipping: {
      trackingNumber: "PX-755001",
      estimatedDelivery: addMinutes(order1021CreatedAt, 4320),
      address: {
        street: "Camino Ruta 25 #123",
        city: "Ciudad Paleta",
        region: "Kanto",
        reference: "Casa con molino de viento",
        zipCode: "00001",
      },
    },
    items: createOrderItems([
      { productId: 115, quantity: 4 },
      { productId: 123, quantity: 3 },
      { productId: 109, quantity: 2 },
    ]),
    notes: "Solicita empaquetado ecológico.",
    statusHistory: [
      { status: "created", label: "Orden creada", timestamp: order1021CreatedAt },
      { status: "processing", label: "Pago confirmado", timestamp: addMinutes(order1021CreatedAt, 50) },
      { status: "completed", label: "Pedido entregado", timestamp: addMinutes(order1021CreatedAt, 4100) },
    ],
  }),
  createOrderRecord({
    id: "ORD-1020",
    customerId: 3,
    customer: "Misty Waterflower",
    customerEmail: "misty@gmail.com",
    customerPhone: "+56 9 3333 4444",
    status: "completed",
    createdAt: order1020CreatedAt,
    payment: {
      method: "Tarjeta de débito",
      transactionId: "PAY-7745210",
      capturedAt: addMinutes(order1020CreatedAt, 34),
    },
    shipping: {
      method: "Retiro en tienda",
      cost: 0,
      carrier: "Sucursal Cerúlea",
      address: {
        street: "Av. Cascada 456",
        city: "Ciudad Celeste",
        region: "Kanto",
        reference: "Mall Acuático, piso 2",
      },
    },
    items: createOrderItems([
      { productId: 102, quantity: 1 },
      { productId: 103, quantity: 2 },
      { productId: 110, quantity: 1 },
    ]),
    notes: "Cliente retirará mañana en la tarde.",
    statusHistory: [
      { status: "created", label: "Orden creada", timestamp: order1020CreatedAt },
      { status: "processing", label: "Listo para retiro", timestamp: addMinutes(order1020CreatedAt, 120) },
      { status: "completed", label: "Retiro efectuado", timestamp: addMinutes(order1020CreatedAt, 1380) },
    ],
  }),
  createOrderRecord({
    id: "ORD-1019",
    customerId: 4,
    customer: "Brock Slate",
    customerEmail: "brock@pokemail.com",
    customerPhone: "+56 9 5555 6666",
    status: "completed",
    createdAt: order1019CreatedAt,
    payment: {
      method: "Transferencia bancaria",
      transactionId: "TRX-552201",
      capturedAt: addMinutes(order1019CreatedAt, 180),
    },
    shipping: {
      carrier: "Onix Cargo",
      trackingNumber: "ONX-991201",
      estimatedDelivery: addMinutes(order1019CreatedAt, 5760),
      address: {
        street: "Calle Roca Dura 789",
        city: "Ciudad Plateada",
        region: "Kanto",
        reference: "Frente al centro Pokémon",
      },
    },
    items: createOrderItems([
      { productId: 125, quantity: 2 },
      { productId: 127, quantity: 1 },
      { productId: 111, quantity: 1 },
      { productId: 113, quantity: 3 },
    ]),
    notes: "",
  }),
  createOrderRecord({
    id: "ORD-1018",
    customerId: 5,
    customer: "Serena Performer",
    customerEmail: "serena@pokemail.com",
    customerPhone: "+56 9 7777 8888",
    status: "completed",
    createdAt: order1018CreatedAt,
    payment: {
      method: "Tarjeta de crédito",
      transactionId: "PAY-9935214",
      capturedAt: addMinutes(order1018CreatedAt, 20),
    },
    shipping: {
      method: "Despacho prioritario",
      carrier: "Rapidash Logistics",
      cost: 4990,
      trackingNumber: "RD-552214",
      estimatedDelivery: addMinutes(order1018CreatedAt, 2160),
      address: {
        street: "Boulevard Lumiose 742",
        city: "Lumiose",
        region: "Kalos",
        reference: "Torre Prisma, depto 1902",
      },
    },
    items: createOrderItems([
      { productId: 105, quantity: 1 },
      { productId: 116, quantity: 1 },
      { productId: 118, quantity: 2 },
      { productId: 124, quantity: 2 },
    ]),
    notes: "Entregar antes del torneo de performances.",
  }),
  createOrderRecord({
    id: "ORD-1017",
    customerId: 6,
    customer: "Gary Oak",
    customerEmail: "gary@pokemail.com",
    customerPhone: "+56 9 9999 0000",
    status: "completed",
    createdAt: order1017CreatedAt,
    payment: {
      method: "Tarjeta de crédito",
      transactionId: "PAY-7823511",
      capturedAt: addMinutes(order1017CreatedAt, 38),
    },
    shipping: {
      carrier: "Arcanine Express",
      trackingNumber: "ARX-215421",
      estimatedDelivery: addMinutes(order1017CreatedAt, 4320),
      address: {
        street: "Camino Laboratorio 321",
        city: "Pueblo Paleta",
        region: "Kanto",
        reference: "Laboratorio del Profesor Oak",
      },
    },
    items: createOrderItems([
      { productId: 110, quantity: 1 },
      { productId: 115, quantity: 3 },
      { productId: 120, quantity: 2 },
      { productId: 127, quantity: 1 },
    ]),
    statusHistory: [
      { status: "created", label: "Orden creada", timestamp: order1017CreatedAt },
      { status: "processing", label: "Listo para despacho", timestamp: addMinutes(order1017CreatedAt, 180) },
      { status: "completed", label: "Pedido entregado", timestamp: addMinutes(order1017CreatedAt, 3360) },
    ],
    notes: "Enviar factura electrónica al correo.",
  }),
  createOrderRecord({
    id: "ORD-1016",
    customerId: 7,
    customer: "Dawn Berlitz",
    customerEmail: "dawn@pokemail.com",
    customerPhone: "+56 9 1212 3434",
    status: "completed",
    createdAt: order1016CreatedAt,
    payment: {
      method: "Tarjeta de crédito",
      transactionId: "PAY-6632147",
      capturedAt: addMinutes(order1016CreatedAt, 26),
    },
    shipping: {
      method: "Despacho estándar",
      carrier: "Staraptor Cargo",
      trackingNumber: "STC-882147",
      estimatedDelivery: addMinutes(order1016CreatedAt, 5040),
      address: {
        street: "Av. Corazón Valiente 678",
        city: "Ciudad Jubileo",
        region: "Sinnoh",
        reference: "Edificio Contest Hall",
      },
    },
    items: createOrderItems([
      { productId: 107, quantity: 1 },
      { productId: 124, quantity: 3 },
      { productId: 122, quantity: 2 },
    ]),
  }),
  createOrderRecord({
    id: "ORD-1015",
    customerId: 8,
    customer: "Hilda Trainer",
    customerEmail: "hilda@pokemail.com",
    customerPhone: "+56 9 5656 7878",
    status: "completed",
    createdAt: order1015CreatedAt,
    payment: {
      method: "Tarjeta de débito",
      transactionId: "PAY-5521145",
      capturedAt: addMinutes(order1015CreatedAt, 18),
    },
    shipping: {
      method: "Despacho prioritario",
      carrier: "Braviary Air",
      cost: 4490,
      trackingNumber: "BRV-661244",
      estimatedDelivery: addMinutes(order1015CreatedAt, 2880),
      address: {
        street: "Av. Castell 321",
        city: "Castelia",
        region: "Unova",
        reference: "Torre Mode, oficina 500",
      },
    },
    items: createOrderItems([
      { productId: 126, quantity: 1 },
      { productId: 103, quantity: 2 },
      { productId: 121, quantity: 3 },
    ]),
    notes: "Agregar mensaje: ¡Suerte en el torneo de Unova!",
  }),
  createOrderRecord({
    id: "ORD-1014",
    customerId: 9,
    customer: "May Maple",
    customerEmail: "may@pokemail.com",
    customerPhone: "+56 9 9090 1010",
    status: "completed",
    createdAt: order1014CreatedAt,
    payment: {
      method: "Tarjeta de crédito",
      transactionId: "PAY-4410021",
      capturedAt: addMinutes(order1014CreatedAt, 31),
    },
    shipping: {
      method: "Retiro en tienda",
      cost: 0,
      carrier: "Sucursal Petalia",
      address: {
        street: "Av. Petalia 99",
        city: "Ciudad Petalia",
        region: "Hoenn",
        reference: "Local Frente a la Florería",
      },
    },
    items: createOrderItems([
      { productId: 101, quantity: 1 },
      { productId: 108, quantity: 1 },
      { productId: 113, quantity: 2 },
    ]),
  }),
  createOrderRecord({
    id: "ORD-1013",
    customerId: 10,
    customer: "Tracey Sketchit",
    customerEmail: "tracey@pokemail.com",
    customerPhone: "+56 9 1313 1414",
    status: "completed",
    createdAt: order1013CreatedAt,
    payment: {
      method: "Cheque",
      status: "Pendiente de confirmación",
      transactionId: "CHQ-712421",
      capturedAt: "",
    },
    shipping: {
      carrier: "Lapras Ferry",
      trackingNumber: "LP-445822",
      estimatedDelivery: addMinutes(order1013CreatedAt, 6480),
      address: {
        street: "Isla Valencia 456",
        city: "Islas Naranja",
        region: "Naranja",
        reference: "Casa con bandera Lapras",
      },
    },
    items: createOrderItems([
      { productId: 109, quantity: 3 },
      { productId: 125, quantity: 1 },
      { productId: 129, quantity: 2 },
    ]),
    statusHistory: [
      { status: "created", label: "Orden creada", timestamp: order1013CreatedAt },
      { status: "processing", label: "Esperando confirmación de pago", timestamp: addMinutes(order1013CreatedAt, 120) },
      { status: "completed", label: "Enviado", timestamp: addMinutes(order1013CreatedAt, 5220) },
    ],
  }),
  createOrderRecord({
    id: "ORD-1012",
    customerId: 11,
    customer: "Lillie Aether",
    customerEmail: "lillie@pokemail.com",
    customerPhone: "+56 9 1515 1616",
    status: "completed",
    createdAt: order1012CreatedAt,
    payment: {
      method: "Tarjeta de crédito",
      transactionId: "PAY-7712451",
      capturedAt: addMinutes(order1012CreatedAt, 19),
    },
    shipping: {
      method: "Despacho estándar",
      carrier: "Cosmog Couriers",
      trackingNumber: "CSM-884411",
      estimatedDelivery: addMinutes(order1012CreatedAt, 5760),
      address: {
        street: "Residencial Aether 321",
        city: "Isla Aether",
        region: "Alola",
        reference: "Edificio principal, torre norte",
      },
    },
    items: createOrderItems([
      { productId: 104, quantity: 1 },
      { productId: 111, quantity: 1 },
      { productId: 118, quantity: 2 },
      { productId: 123, quantity: 2 },
    ]),
    statusHistory: [
      { status: "created", label: "Orden creada", timestamp: order1012CreatedAt },
      { status: "processing", label: "Preparando despacho", timestamp: addMinutes(order1012CreatedAt, 180) },
      { status: "completed", label: "Pedido entregado", timestamp: addMinutes(order1012CreatedAt, 5220) },
    ],
    notes: "Añadir tarjeta con mensaje: 'De mamá con cariño'.",
  }),
];

const getOrderById = (orderId) => seedOrders.find((order) => order.id === orderId);

export { seedOrders, getOrderById };
