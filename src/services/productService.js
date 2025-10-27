import rawProducts from "@/data/productos.json";

const productDataset = Array.isArray(rawProducts) ? rawProducts : rawProducts?.products ?? [];
const PRODUCT_STORAGE_KEY = "pokemart.admin.products";
const PRODUCTS_EVENT = "products-data-changed";

const normalizeImageName = (product) => {
  if (product.imagenNombre) return String(product.imagenNombre).trim();
  if (typeof product.imagen === "string" && product.imagen) {
    const segments = product.imagen.split("/");
    return segments[segments.length - 1] ?? "";
  }
  return "";
};

const mapProduct = (product, baseStockFallback) => {
  const stock = Number(product.stock) || 0;
  const stockBaseCandidate =
    product.stockBase ?? baseStockFallback ?? product.stock ?? 0;
  const stockBase =
    Number.isFinite(Number(stockBaseCandidate)) && Number(stockBaseCandidate) > 0
      ? Number(stockBaseCandidate)
      : stock;

  return {
    id: Number(product.id),
    nombre: String(product.nombre ?? "").trim(),
    categoria: String(product.categoria ?? "Sin categoría").trim() || "Sin categoría",
    precio: Number(product.precio) || 0,
    stock,
    stockBase,
    imagen: product.imagen ?? "",
    imagenNombre: normalizeImageName(product),
    descripcion: String(
      product.descripcion ??
        "Producto del catálogo Poké Mart. Actualizaremos su descripción más adelante.",
    ).trim(),
  };
};

const baseProducts = productDataset.map((product) =>
  mapProduct({ ...product, stockBase: product.stock }, product.stock),
);

const emitChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PRODUCTS_EVENT));
  }
};

const readOverrides = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return { added: [], updated: {} };
  }
  try {
    const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!raw) return { added: [], updated: {} };
    const parsed = JSON.parse(raw);
    const added = Array.isArray(parsed?.added)
      ? parsed.added.map((item) => mapProduct(item, item.stockBase ?? item.stock))
      : [];
    const updated =
      parsed?.updated && typeof parsed.updated === "object" ? parsed.updated : {};
    return { added, updated };
  } catch (error) {
    console.warn("No se pudieron leer los productos personalizados", error);
    return { added: [], updated: {} };
  }
};

const writeOverrides = (overrides) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(
    PRODUCT_STORAGE_KEY,
    JSON.stringify({
      added: overrides.added ?? [],
      updated: overrides.updated ?? {},
    }),
  );
  emitChange();
};

const mergeProducts = () => {
  const overrides = readOverrides();
  const updatedEntries = overrides.updated ?? {};
  const mergedBase = baseProducts.map((product) => {
    const override = updatedEntries?.[product.id];
    return override
      ? mapProduct(
          { ...product, ...override, stockBase: override.stockBase ?? product.stockBase },
          product.stockBase,
        )
      : product;
  });
  return [...mergedBase, ...(overrides.added ?? [])];
};

const getAllProducts = () => mergeProducts();

const getProductById = (id) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return undefined;
  return getAllProducts().find((item) => item.id === numericId);
};

const getProductCategories = () => {
  const categories = new Set();
  getAllProducts().forEach((product) => {
    if (product?.categoria) categories.add(product.categoria);
  });
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
};

const getNextProductId = () => {
  const all = getAllProducts();
  const maxId = all.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0);
  return maxId + 1;
};

const createProduct = (productData) => {
  const allProducts = getAllProducts();
  if (allProducts.some((p) => Number(p.id) === Number(productData.id))) {
    throw new Error(`Ya existe un producto con el ID ${productData.id}`);
  }

  const newProduct = mapProduct(
    {
      ...productData,
      stockBase:
        productData.stockBase ?? productData.stock ?? Number(productData.stock) ?? 0,
    },
    productData.stockBase ?? productData.stock ?? 0,
  );
  const overrides = readOverrides();
  overrides.added = [...(overrides.added ?? []), newProduct];
  writeOverrides(overrides);
  return newProduct;
};

const updateProduct = (productId, changes) => {
  const numericId = Number(productId);
  if (Number.isNaN(numericId)) {
    throw new Error("ID de producto inválido");
  }
  const existing = getProductById(numericId);
  if (!existing) {
    throw new Error(`No se encontró el producto ${numericId}`);
  }

  const overrides = readOverrides();
  const nextProduct = mapProduct(
    { ...existing, ...changes, id: numericId, stockBase: existing.stockBase },
    existing.stockBase,
  );
  overrides.updated = {
    ...(overrides.updated ?? {}),
    [numericId]: nextProduct,
  };
  writeOverrides(overrides);
  return getProductById(numericId);
};

const resetProducts = () => {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.removeItem(PRODUCT_STORAGE_KEY);
  emitChange();
};

const subscribeToProductChanges = (callback) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback?.();
  window.addEventListener(PRODUCTS_EVENT, handler);
  return () => window.removeEventListener(PRODUCTS_EVENT, handler);
};

export {
  getAllProducts,
  getProductById,
  getProductCategories,
  getNextProductId,
  createProduct,
  updateProduct,
  subscribeToProductChanges,
  PRODUCTS_EVENT,
  PRODUCT_STORAGE_KEY,
  resetProducts,
};
