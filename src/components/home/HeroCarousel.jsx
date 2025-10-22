// src/components/home/HeroCarousel.jsx
import { useEffect, useRef } from "react";
import Carousel from "bootstrap/js/dist/carousel";

export const HeroCarousel = ({ slides = [], interval = 2500 }) => {
  const ref = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // si no hay items, no inicializamos
    const hasItems = !!el.querySelector(".carousel-item");
    if (!hasItems) return;

    // evita reinstalar si ya existe
    if (!instanceRef.current) {
      try {
        instanceRef.current = Carousel.getOrCreateInstance(el, {
          interval,
          ride: "carousel",
          pause: false,
          wrap: true,
          touch: true,
        });
      } catch (e) {
      }
    }

    return () => {
      try {
        instanceRef.current?.dispose();
      } finally {
        instanceRef.current = null;
      }
    };
  }, [interval, slides.length]);

  return (
    <div
      className="hero-carousel carousel slide rounded-3 overflow-hidden"
      ref={ref}
      aria-label="Galería de imágenes Pokémon"
    >
      <div className="carousel-inner">
        {slides.map((s, i) => (
          <div key={s.src} className={`carousel-item ${i === 0 ? "active" : ""}`}>
            <img src={s.src} className="d-block w-100" alt={s.alt || ""} />
          </div>
        ))}
      </div>
    </div>
  );
};
