// usado por HomePage.jsx
// src/components/home/HeroCarousel.jsx
import { useEffect, useRef } from "react";
import Carousel from "bootstrap/js/dist/carousel";

export const HeroCarousel = ({ slides = [], interval = 2500 }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const instance = Carousel.getOrCreateInstance(ref.current, {
      interval,
      ride: "carousel",
      pause: false,
      wrap: true,
      touch: true,
    });
    return () => instance?.dispose();
  }, [interval]);

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
