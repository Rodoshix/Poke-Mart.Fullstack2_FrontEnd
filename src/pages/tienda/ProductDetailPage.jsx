// src/pages/tienda/ProductDetailPage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageBorders from "@/components/layout/PageBorders";
import "@/assets/styles/product-detail.css";

import { useProductDetail } from "@/hooks/useProductDetail";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBuyBox from "@/components/product/ProductBuyBox";

import { RelatedProducts } from "@/components/catalog/RelatedProducts.jsx";
import { Reviews } from "@/components/reviews/Reviews.jsx";

import { useProductReviews } from "@/hooks/useProductReviews.js";
import useAuthSession from "@/hooks/useAuthSession.js";
import LoaderOverlay from "@/components/common/LoaderOverlay.jsx";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { session } = useAuthSession();
  const [delayLoader, setDelayLoader] = useState(true);

  const {
    product,
    gallery,
    mainSrc,
    setMainSrc,
    available,
    qty,
    setQty,
    addToCart,
    related,
  } = useProductDetail(id);
  const { items: reviews, addReview } = useProductReviews(id);
  const canReview = Boolean(session);

  useEffect(() => {
    const t = setTimeout(() => setDelayLoader(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!product) {
    if (delayLoader) {
      return (
        <main className="container py-5">
          <LoaderOverlay text="Cargando producto..." />
        </main>
      );
    }
    return (
      <main className="container py-5">
        <h2 className="mb-2">Ups…</h2>
        <p className="text-secondary">Producto no encontrado.</p>
        <Link className="btn btn-primary" to="/catalogo">
          Volver a productos
        </Link>
      </main>
    );
  }

  return (
    <>
      <PageBorders />

      <main className="site-main container my-4 flex-grow-1">
        <ProductBreadcrumbs name={product.nombre} />

        <section className="product row g-4">
          <div className="product__gallery col-12 col-lg-7">
            <ProductGallery
              images={gallery}
              mainSrc={mainSrc}
              onSelect={setMainSrc}
              alt={product.nombre}
            />
          </div>

          <ProductBuyBox
            name={product.nombre}
            price={product.precio}
            description={product.descripcion}
            available={available}
            qty={qty}
            setQty={setQty}
            onAdd={addToCart}
          />
        </section>

        <RelatedProducts items={related} />
        <Reviews reviews={reviews} onSubmit={addReview} canReview={canReview} />
      </main>
    </>
  );
}
