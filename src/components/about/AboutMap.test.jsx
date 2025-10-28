// src/components/about/AboutMap.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutMap from "./AboutMap";

describe("Testing AboutMap", () => {
  it("CP-Map1: Renderiza heading e imagen con valores por defecto", () => {
    render(<AboutMap />);

    const heading = screen.getByRole("heading", {
      level: 3,
      name: /cómo llegar/i,
    });
    expect(heading).toBeInTheDocument();

    const img = screen.getByRole("img", {
      name: /mapa de ubicación de poké mart — sucursal central/i,
    });
    expect(img).toHaveAttribute("src", "/src/assets/img/mapa-pokemart.png");
    expect(img).toHaveAttribute(
      "alt",
      "Mapa de ubicación de Poké Mart — Sucursal Central"
    );
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("CP-Map2: Acepta props personalizados (heading, src, alt)", () => {
    render(
      <AboutMap
        heading="Ubicación"
        src="/custom/map.png"
        alt="Mapa personalizado"
      />
    );

    expect(
      screen.getByRole("heading", { level: 3, name: /ubicación/i })
    ).toBeInTheDocument();

    const img = screen.getByRole("img", { name: /mapa personalizado/i });
    expect(img).toHaveAttribute("src", "/custom/map.png");
    expect(img).toHaveAttribute("alt", "Mapa personalizado");
  });

  it("CP-Map3: Estructura de clases: wrapper, frame y img anidada", () => {
    const { container } = render(<AboutMap />);

    const wrapper = container.querySelector(
      "div.about-map.d-flex.flex-column"
    );
    expect(wrapper).toBeInTheDocument();

    const frame = wrapper?.querySelector(
      "div.about-map__frame.rounded.overflow-hidden"
    );
    expect(frame).toBeInTheDocument();

    const headingEl = wrapper?.querySelector("h3.about-map__heading.h4");
    expect(headingEl).toBeInTheDocument();

    const img = frame?.querySelector("img.about-map__img");
    expect(img).toBeInTheDocument();
  });

  it("CP-Map4: La imagen está dentro del frame y mantiene loading/decoding", () => {
    const { container } = render(<AboutMap />);
    const frame = container.querySelector("div.about-map__frame");
    const img = screen.getByRole("img", {
      name: /poké mart — sucursal central/i,
    });

    expect(frame).toBeInTheDocument();
    expect(frame).toContainElement(img);

    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });
});
