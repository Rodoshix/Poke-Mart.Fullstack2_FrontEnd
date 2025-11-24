// src/pages/tienda/OffersPage.jsx
import { useEffect } from "react";
import "@/assets/styles/ofertas.css";

import { useOffers } from "@/hooks/useOffers";
import OffersToolbar from "@/components/offers/OffersToolbar";
import OfferCard from "@/components/offers/OfferCard";
import OffersEmpty from "@/components/offers/OffersEmpty";
import LoaderOverlay from "@/components/common/LoaderOverlay.jsx";

export default function OffersPage() {
  useEffect(() => {
    document.body.classList.add("page--ofertas");
    return () => document.body.classList.remove("page--ofertas");
  }, []);

  const { sort, setSort, items, hasItems, addToCart, loading } = useOffers();

  return (
    <main className="site-main container py-4">
      <OffersToolbar sort={sort} onChange={setSort} />

      {loading ? (
        <LoaderOverlay text="Cargando ofertas..." />
      ) : !hasItems ? (
        <OffersEmpty />
      ) : (
        <section className="row g-3">
          {items.map((p) => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <OfferCard product={p} onAdd={addToCart} />
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
