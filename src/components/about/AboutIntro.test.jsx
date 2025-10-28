// src/components/about/AboutIntro.test.jsx
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutIntro from "./AboutIntro";

describe("Testing AboutIntro", () => {
  it("CP-Intro1: Renderiza el título y el párrafo introductorio", () => {
    render(<AboutIntro />);

    const heading = screen.getByRole("heading", {
      level: 2,
      name: /sobre nosotros/i,
    });
    expect(heading).toBeInTheDocument();

    expect(
      screen.getByText(/equipamos a entrenadores y aventureros/i)
    ).toBeInTheDocument();
  });

  it("CP-Intro2: Contiene la marca en negrita dentro del párrafo (Poké Mart con NBSP)", () => {
    render(<AboutIntro />);

    const strongBrand = screen.getByText((_, node) => {
      return (
        node?.tagName === "STRONG" &&
        /Poké(?:\s|\u00A0)?Mart/i.test(node.textContent || "")
      );
    });
    expect(strongBrand).toBeInTheDocument();

    const para = strongBrand.closest("p");
    expect(para).toBeInTheDocument();
    expect(para).toHaveClass("about__intro");
    expect(para).toHaveClass("lead");
  });

  it("CP-Intro3: Menciona categorías clave del catálogo", () => {
    render(<AboutIntro />);
    expect(screen.getByText(/poké balls/i)).toBeInTheDocument();
    expect(screen.getByText(/curación/i)).toBeInTheDocument();
    expect(screen.getByText(/tecnología/i)).toBeInTheDocument();
    expect(screen.getByText(/expedición/i)).toBeInTheDocument();
    expect(screen.getByText(/transporte/i)).toBeInTheDocument();
    expect(screen.getByText(/ropa temática/i)).toBeInTheDocument();
  });

  it("CP-Intro4: Estructura semántica y clases Bootstrap (section > row > col-12)", () => {
    const { container } = render(<AboutIntro />);

    const section = container.querySelector("section.about.container.py-5");
    expect(section).toBeInTheDocument();

    const row = section?.querySelector("div.row.gy-4");
    expect(row).toBeInTheDocument();

    const col = row?.querySelector("div.col-12");
    expect(col).not.toBeNull();

    const utils = within(col);
    expect(
      utils.getByRole("heading", { level: 2, name: /sobre nosotros/i })
    ).toBeInTheDocument();
  });
});
