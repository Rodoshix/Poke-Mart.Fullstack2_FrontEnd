// usado por NosotrosPage.jsx
// src/components/about/AboutMap.jsx
import { aboutMap } from "@/assets/images.js";
export default function AboutMap({
  heading = "Cómo llegar",
  src = aboutMap,
  alt = "Mapa de ubicación de Poké Mart – Sucursal Central",
}) {
  return (
    <div className="about-map flex-grow-1 d-flex flex-column">
      <h3 className="about-map__heading h4">{heading}</h3>
      <div className="about-map__frame rounded overflow-hidden">
        <img className="about-map__img" src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  );
}
