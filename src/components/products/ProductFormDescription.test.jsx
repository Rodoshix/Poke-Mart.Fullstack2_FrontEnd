import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductFormDescription from "./ProductFormDescription.jsx";

describe("Testing ProductFormDescription", () => {
  const baseProps = {
    value: "Descripción extensa del producto",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductFormDescription1: Renderiza el textarea con configuración requerida", () => {
    render(<ProductFormDescription {...baseProps} />);

    const textarea = screen.getByLabelText("Descripción");
    expect(textarea).toHaveValue("Descripción extensa del producto");
    expect(textarea).toHaveAttribute("rows", "6");
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute("minLength", "10");
  });

  it("CP-ProductFormDescription2: Propaga cambios cuando se edita el texto", () => {
    render(<ProductFormDescription {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Descripción"), { target: { value: "Nuevo contenido" } });
    expect(baseProps.onChange).toHaveBeenCalledTimes(1);
  });
});
