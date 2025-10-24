// src/hooks/useOffers.js
import { useMemo, useState } from "react";
import useProductsData from "@/hooks/useProductsData.js";
import offers from "@/data/ofertas.json";
import * as cartStore from "@/lib/cartStore";
import { getOfferInfo } from "@/lib/offers";       // ⬅️ usa el lib
import { resolveImg } from "@/utils/resolveImg";

export function useOffers() {
  const products = useProductsData();
  const overlayById = useMemo(() => {
    const list = Array.isArray(offers) ? offers : [];
    return new Map(list.map((o) => [String(o.id), o]));
  }, []);

  const items = useMemo(() => {
    const raw = Array.isArray(products) ? products : [];
    return raw
      .map((p) => {
        const offer = getOfferInfo(p, overlayById);
        return {
          ...p,
          img: resolveImg(p.imagen),
          stock: Number(p.stock ?? 0),
          offer,
        };
      })
      .filter((x) => x.offer.onSale);
  }, [overlayById, products]);

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

  const addToCart = (p) => {
    const available = cartStore.getAvailableStock(String(p.id), Number(p.stock ?? 0));
    if (available <= 0) return;
    const offerPrice = Number.isFinite(p.offer.price) ? p.offer.price : Number(p.precio ?? 0);

    cartStore.addItem(
      {
        id: p.id,
        nombre: p.nombre,
        precio: offerPrice,
        price: offerPrice,
        _offer: {
          base: Number(p.precio ?? 0),
          price: offerPrice,
          discountPct: p.offer.discountPct,
          endsAt: p.offer.endsAt,
        },
      },
      1
    );
    window.dispatchEvent(new Event("cart:updated"));
  };

  return { sort, setSort, items: sorted, hasItems: sorted.length > 0, addToCart };
}
