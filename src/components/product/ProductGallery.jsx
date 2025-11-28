// usado por ProductDetailPage.jsx
// src/components/product/ProductGallery.jsx
import { productFallback } from "@/assets/images.js";

const PLACEHOLDER = productFallback;

export default function ProductGallery({ images = [], mainSrc, onSelect, alt }) {
  return (
    <div className="product-gallery card">
      <div className="product-gallery__main ratio ratio-4x3">
        <img
          className="product-gallery__img"
          src={mainSrc}
          alt={alt}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
      </div>
      <div className="product-gallery__thumbs d-flex gap-2 p-3 border-top">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            className={`thumb ${src === mainSrc ? "thumb--active" : ""}`}
            onClick={() => onSelect?.(src)}
            aria-label={`miniatura ${i + 1}`}
          >
            <img src={src} alt="" onError={(e) => (e.currentTarget.src = PLACEHOLDER)} />
          </button>
        ))}
      </div>
    </div>
  );
}
