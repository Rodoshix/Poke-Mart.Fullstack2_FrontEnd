// usado por ContactoPage.jsx
// src/components/contact/ContactMap.jsx
const MAP_IMG = "/src/assets/img/tienda/world/pokemon_galar_map.png";

export default function ContactMap({ src = MAP_IMG, alt = "Mapa del mundo Pokémon" }) {
  return (
    <figure className="contacto-figure mb-0">
      <img src={src} alt={alt} className="contacto-figure__img" />
    </figure>
  );
}
