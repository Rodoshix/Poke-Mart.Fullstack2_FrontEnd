// usado por ContactoPage.jsx
// src/components/contact/ContactMap.jsx
import { mapGalar } from "@/assets/images.js";
const MAP_IMG = mapGalar;

export default function ContactMap({ src = MAP_IMG, alt = "Mapa del mundo Pokémon" }) {
  return (
    <figure className="contacto-figure mb-0">
      <img src={src} alt={alt} className="contacto-figure__img" />
    </figure>
  );
}
