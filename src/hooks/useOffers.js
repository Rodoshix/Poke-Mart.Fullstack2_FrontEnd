// src/hooks/useOffers.js
import { useEffect, useMemo, useRef, useState } from "react";
import useProductsData from "@/hooks/useProductsData.js";
import { getOfferInfo } from "@/lib/offers";
import { resolveImg } from "@/utils/resolveImg";
import { fetchOffers } from "@/services/catalogApi";

export function useOffers() {
  const products = useProductsData();
  const [loading, setLoading] = useState(true);
  const startRef = useRef(Date.now());
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const elapsed = Date.now() - startRef.current;
    const wait = Math.max(0, 3000 - elapsed);
    const t = setTimeout(() => setLoading(false), wait);
    return () => clearTimeout(t);
  }, [products]);

  useEffect(() => {
    let cancelled = false;
    const loadOffers = async () => {
      try {
        const data = await fetchOffers();
        if (!cancelled) {
          setOffers(Array.isArray(data) ? data : []);
        }
      } catch (_) {
        if (!cancelled) {
          setOffers([]);
        }
      }
    };
    loadOffers();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const raw = Array.isArray(products) ? products : [];
    const offersMap = new Map();
    offers.forEach((o) => {
      if (o?.id != null) offersMap.set(o.id, o);
    });
    return raw
      .map((p) => {
        const fromOffers = offersMap.get(p.id);
        const offer = p.oferta ?? fromOffers?.offer ?? getOfferInfo({
          ...p,
          discountPct: (fromOffers?.discountPct ?? p.discountPct ?? p.offer?.discountPct) ?? 0,
          endsAt: fromOffers?.endsAt ?? p.endsAt ?? p.offer?.endsAt ?? null,
        });
        const basePrice = Number(p.precioBase ?? p.precio ?? 0);
        const offerPrice = offer.onSale ? offer.price : basePrice;
        return {
          ...p,
          img: resolveImg(p.imagen),
          stock: Number(p.stock ?? 0),
          offer: { ...offer, price: offerPrice, basePrice },
        };
      })
      .filter((x) => x.offer.onSale);
  }, [products, offers]);

  const [sort, setSort] = useState("best");
  const sorted = useMemo(() => {
    const list = items.slice();
    switch (sort) {
      case "priceAsc":  list.sort((a, b) => a.offer.price - b.offer.price); break;
      case "priceDesc": list.sort((a, b) => b.offer.price - a.offer.price); break;
      case "ending":
        list.sort(
          (a, b) =>
            (a.offer.expiresInMs == null ? Number.POSITIVE_INFINITY : a.offer.expiresInMs) -
            (b.offer.expiresInMs == null ? Number.POSITIVE_INFINITY : b.offer.expiresInMs)
        );
        break;
      case "best":
      default:
        list.sort((a, b) => b.offer.discountPct - a.offer.discountPct);
    }
    return list;
  }, [items, sort]);

  return { sort, setSort, items: sorted, hasItems: sorted.length > 0, loading };
}
