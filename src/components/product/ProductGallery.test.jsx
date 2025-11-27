import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductGallery from "./ProductGallery.jsx";
import { productFallback } from "@/assets/images.js";

const PLACEHOLDER = productFallback;

describe("Testing ProductGallery", () => {
  const baseProps = {
    images: ["/img/1.png", "/img/2.png"],
    mainSrc: "/img/1.png",
    alt: "Producto principal",
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductGallery1: Renderiza la imagen principal y miniaturas", () => {
    render(<ProductGallery {...baseProps} />);

    expect(screen.getByAltText("Producto principal")).toHaveAttribute("src", "/img/1.png");
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveClass("thumb--active");
  });

  it("CP-ProductGallery2: Cambia la imagen seleccionada al hacer clic en una miniatura", () => {
    render(<ProductGallery {...baseProps} />);

    fireEvent.click(screen.getByLabelText("miniatura 2"));
    expect(baseProps.onSelect).toHaveBeenCalledWith("/img/2.png");
  });

  it("CP-ProductGallery3: Reemplaza la imagen con el placeholder cuando carga falla", () => {
    render(<ProductGallery {...baseProps} />);

    const mainImg = screen.getByAltText("Producto principal");
    fireEvent.error(mainImg);
    expect(mainImg).toHaveAttribute("src", PLACEHOLDER);

    const thumbImg = screen.getAllByRole("img", { hidden: true })[0];
    fireEvent.error(thumbImg);
    expect(thumbImg).toHaveAttribute("src", PLACEHOLDER);
  });
});
