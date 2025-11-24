import { useEffect, useState } from "react";
import { fetchProducts } from "@/services/catalogApi.js";
import { getOfferInfo } from "@/lib/offers.js";

const enhanceProduct = (p = {}) => {
  const offer = getOfferInfo({
    ...p,
    discountPct: p.discountPct ?? p.offer?.discountPct ?? 0,
    endsAt: p.endsAt ?? p.offer?.endsAt ?? null,
  });
  const basePrice = Number(p.precio ?? 0);
  const finalPrice = offer.onSale ? offer.price : basePrice;
  return {
    ...p,
    precioBase: offer.basePrice ?? basePrice,
    precio: finalPrice,
    oferta: offer,
  };
};

const useProductsData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts();
        if (!cancelled) {
          const mapped = Array.isArray(data) ? data.map(enhanceProduct) : [];
          setProducts(mapped);
        }
      } catch (_) {
        if (!cancelled) {
          setProducts([]);
          setError("No se pudieron cargar los productos. Intenta nuevamente en un momento.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return Object.assign(products, { loading, error });
};

export default useProductsData;
