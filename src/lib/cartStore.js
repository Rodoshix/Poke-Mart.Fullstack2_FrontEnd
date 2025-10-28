// src/lib/cartStore.js
const CART_KEY = "pm_cart";
const COUNT_KEY = "cartCount";
const MAX_QTY = 99;

function parseNumber(val, def = 0) {
  const n = Number(val);
  return Number.isFinite(n) ? n : def;
}
function clampQty(q) {
  const n = Math.floor(parseNumber(q, 0));
  if (Number.isNaN(n) || n <= 0) return 0;
  return Math.min(n, MAX_QTY);
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const id = item.id ?? item.productId ?? item.slug;
        const qty = clampQty(item.qty ?? item.quantity ?? item.cant);
        if (!id || !qty) return null;
        return {
          id: String(id),
          qty,
          price: parseNumber(item.price, 0),
          name: typeof item.name === "string" ? item.name : String(item.title ?? ""),
          image: typeof item.image === "string" ? item.image : String(item.img ?? item.thumbnail ?? ""),
          stock: Number.isFinite(item.stock) ? Number(item.stock) : undefined,
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function writeCart(items) {
  const clean = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const id = item.id ?? item.productId;
    const qty = clampQty(item.qty);
    if (!id || !qty) continue;
    clean.push({
      id: String(id),
      qty,
      price: parseNumber(item.price, 0),
      name: typeof item.name === "string" ? item.name : "",
      image: typeof item.image === "string" ? item.image : "",
      stock: Number.isFinite(item.stock) ? Number(item.stock) : undefined,
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(clean));
  const total = clean.reduce((sum, item) => sum + item.qty, 0);
  localStorage.setItem(COUNT_KEY, String(total));
  try {
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: total } }));
  } catch {}
  return clean;
}

function getItem(cart, id) {
  const strId = String(id);
  return cart.find((item) => item.id === strId);
}
function getStoredStock(cartItem, fallback) {
  if (Number.isFinite(fallback)) return Number(fallback);
  if (cartItem && Number.isFinite(cartItem.stock)) return Number(cartItem.stock);
  return Number.isFinite(fallback) ? Number(fallback) : MAX_QTY;
}
function getBaseStock(product, cartItem) {
  if (product) {
    const candidates = [product.stockOriginal, product.stock, product.baseStock, product.max];
    for (const val of candidates) {
      if (Number.isFinite(val)) return Number(val);
      if (typeof val === "string") {
        const parsed = Number(val);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
  }
  if (cartItem && Number.isFinite(cartItem.stock)) return Number(cartItem.stock);
  return MAX_QTY;
}
function makeCartItem(product, qty, baseStock) {
  return {
    id: String(product.id),
    qty,
    price: parseNumber(product.precio ?? product.price, 0),
    name: typeof product.nombre === "string" ? product.nombre : String(product.name ?? ""),
    image: typeof product.imagen === "string" ? product.imagen : String(product.image ?? ""),
    stock: Number.isFinite(baseStock) ? Number(baseStock) : undefined,
  };
}

export function addItem(product, qty = 1) {
  if (!product || product.id == null) return { added: 0, available: 0, cart: readCart() };
  const desired = clampQty(qty);
  if (!desired) return { added: 0, available: 0, cart: readCart() };

  const cart = readCart();
  const existing = getItem(cart, product.id);
  const baseStock = getBaseStock(product, existing);
  const currentQty = existing ? existing.qty : 0;
  const available = Math.max(0, baseStock - currentQty);
  const toAdd = Math.min(desired, available);

  if (toAdd <= 0) return { added: 0, available, cart };

  if (existing) {
    existing.qty = clampQty(existing.qty + toAdd);
    existing.price = parseNumber(product.precio ?? product.price, existing.price);
    if (product.nombre || product.name) existing.name = product.nombre ?? product.name;
    if (product.imagen || product.image) existing.image = product.imagen ?? product.image;
    if (Number.isFinite(baseStock)) existing.stock = Number(baseStock);
  } else {
    cart.push(makeCartItem(product, toAdd, baseStock));
  }

  const updated = writeCart(cart);
  const remaining = Math.max(0, baseStock - (currentQty + toAdd));
  return { added: toAdd, available: remaining, cart: updated };
}

export function setItemQty(id, qty, baseStock) {
  const strId = String(id);
  const cart = readCart();
  const existing = getItem(cart, strId);
  const maxStock = getStoredStock(existing, baseStock);
  const desired = clampQty(qty);
  const limited = Math.min(desired, Math.max(0, maxStock));

  if (!limited) {
    if (existing) {
      const idx = cart.indexOf(existing);
      cart.splice(idx, 1);
    }
    return writeCart(cart);
  }

  if (existing) {
    existing.qty = limited;
    if (Number.isFinite(baseStock)) existing.stock = Number(baseStock);
    return writeCart(cart);
  }

  cart.push({ id: strId, qty: limited, price: 0 });
  return writeCart(cart);
}

export function removeItem(id) {
  const cart = readCart();
  const existing = getItem(cart, id);
  if (!existing) return cart;
  const idx = cart.indexOf(existing);
  cart.splice(idx, 1);
  return writeCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  localStorage.setItem(COUNT_KEY, "0");
  try {
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: 0 } }));
  } catch {}
  return [];
}

export function getCount() {
  const cart = readCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
export function getCart() { return readCart(); }
export function getItemQty(id) {
  const cart = readCart();
  const existing = getItem(cart, id);
  return existing ? existing.qty : 0;
}
export function getAvailableStock(id, baseStock) {
  const cart = readCart();
  const existing = getItem(cart, id);
  const stock = getBaseStock({ stock: baseStock }, existing);
  const qty = existing ? existing.qty : 0;
  return Math.max(0, stock - qty);
}

export const CART_KEYS = { CART_KEY, COUNT_KEY };
