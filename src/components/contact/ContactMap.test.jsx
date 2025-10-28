import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactMap from "./ContactMap.jsx";

describe("Testing ContactMap", () => {
  it("CP-ContactMap1: Renderiza el mapa con valores por defecto", () => {
    render(<ContactMap />);

    const img = screen.getByAltText("Mapa del mundo Pokémon");
    expect(img).toHaveAttribute("src", "/src/assets/img/tienda/world/pokemon_galar_map.png");
    expect(img).toHaveClass("contacto-figure__img");
  });

  it("CP-ContactMap2: Permite personalizar la imagen y el texto alternativo", () => {
    render(<ContactMap src="/mapa-personalizado.png" alt="Ubicación alternativa" />);

    expect(screen.getByAltText("Ubicación alternativa")).toHaveAttribute("src", "/mapa-personalizado.png");
  });
});
