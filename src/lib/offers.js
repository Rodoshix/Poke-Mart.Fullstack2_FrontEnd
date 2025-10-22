// src/lib/offers.js
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const pick = (obj, keys, def) => {
  for (const k of keys) if (obj?.[k] != null) return obj[k];
  return def;
};

/**
 * Calcula la oferta efectiva de un producto combinando:
 *  - datos base del producto (precio, precioOferta, descuento, ofertaFin, compareAtPrice)
 *  - overlay de campañas (salePrice, discountPct, endsAt) tomado desde ofertas.json
 *
 * @param {Object} p - producto base (de productos.json)
 * @param {Map<string, Object>} overlayById - Map por id con ofertas (de ofertas.json)
 * @returns {{
 *   onSale: boolean,
 *   price: number,           // precio final a cobrar (si hay oferta, el precio de oferta)
 *   basePrice: number,       // precio base/compare (para mostrar tachado si aplica)
 *   discountPct: number,     // porcentaje de descuento efectivo
 *   endsAt: string|null,     // fecha fin ISO si existe
 *   expiresInMs: number|null // ms restantes si hay endsAt
 * }}
 */
export function getOfferInfo(p = {}, overlayById = null) {
  const basePrice = num(
    pick(p, ["precio", "price", "precioBase", "precio_listado", "regularPrice"], 0)
  );

  let salePrice = num(p.precioOferta ?? p.offerPrice ?? p.salePrice);
  let pct = num(p.descuento ?? p.discountPct ?? p.discount);
  let endsAt = p.ofertaFin ?? p.ofertaHasta ?? p.saleEndsAt ?? p.endsAt ?? null;


  const compare = Math.max(num(p.precioAnterior ?? p.compareAtPrice ?? 0), basePrice);

  const idKey = String(p.id ?? "");
  if (overlayById?.has(idKey)) {
    const ov = overlayById.get(idKey);
    if (ov.salePrice != null) salePrice = num(ov.salePrice);
    if (ov.discountPct != null) pct = num(ov.discountPct);
    if (ov.endsAt != null) endsAt = ov.endsAt;
  }

  // Resolver precio/pct coherentes
  if (salePrice > 0 && salePrice < Math.max(basePrice, compare)) {
    const effectiveBase = Math.max(compare, basePrice);
    pct = Math.round((1 - salePrice / effectiveBase) * 100);
  } else if (pct > 0 && pct < 100) {
    const effectiveBase = Math.max(compare, basePrice);
    salePrice = Math.round(effectiveBase * (1 - pct / 100));
  } else if (compare > basePrice && basePrice > 0) {
    salePrice = basePrice;
    pct = Math.round((1 - salePrice / compare) * 100);
  }

  let expired = false;
  let expiresInMs = null;
  if (endsAt) {
    const endMs = Date.parse(endsAt);
    if (!Number.isNaN(endMs)) {
      const diff = endMs - Date.now();
      expiresInMs = diff;
      expired = diff <= 0;
    }
  }

  const hasCoherentSale = salePrice > 0 && pct > 0 && pct < 100;
  const onSale = hasCoherentSale && !expired;
  const price = onSale ? salePrice : basePrice;

  return {
    onSale,
    price,
    basePrice: onSale ? Math.max(compare, basePrice) : basePrice,
    discountPct: onSale ? pct : 0,
    endsAt: endsAt || null,
    expiresInMs,
  };
}
