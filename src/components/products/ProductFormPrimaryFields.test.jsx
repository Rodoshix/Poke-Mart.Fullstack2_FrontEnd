import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductFormPrimaryFields from "./ProductFormPrimaryFields.jsx";

describe("Testing ProductFormPrimaryFields", () => {
  const baseProps = {
    formState: {
      nombre: "Poción Max",
      categoria: "Consumo",
    },
    allowedCategories: ["Consumo", "Accesorios"],
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductFormPrimaryFields1: Renderiza los campos con los valores actuales", () => {
    render(<ProductFormPrimaryFields {...baseProps} />);

    expect(screen.getByLabelText("Nombre")).toHaveValue("Poción Max");
    expect(screen.getByLabelText("Categoría")).toHaveDisplayValue("Consumo");
    expect(screen.getByLabelText("Nombre")).toHaveAttribute("maxLength", "120");
    expect(screen.getByLabelText("Categoría")).toBeRequired();
  });

  it("CP-ProductFormPrimaryFields2: Propaga cambios de nombre y categoría", () => {
    render(<ProductFormPrimaryFields {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Super Poción" } });
    fireEvent.change(screen.getByLabelText("Categoría"), { target: { value: "Accesorios" } });

    expect(baseProps.onChange).toHaveBeenCalledTimes(2);
  });
});
