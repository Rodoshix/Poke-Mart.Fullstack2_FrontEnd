import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageBorders from "./PageBorders.jsx";

describe("Testing PageBorders", () => {
  it("CP-PageBorders1: Renderiza dos imágenes con clases por defecto", () => {
    render(<PageBorders />);

    const images = screen.getAllByAltText("");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveClass("left-border");
    expect(images[1]).toHaveClass("right-border");
  });

  it("CP-PageBorders2: Permite personalizar src y clases", () => {
    render(<PageBorders src="/custom.png" leftClass="left" rightClass="right" />);

    const images = screen.getAllByAltText("");
    expect(images[0]).toHaveAttribute("src", "/custom.png");
    expect(images[0]).toHaveClass("left");
    expect(images[1]).toHaveClass("right");
  });
});
