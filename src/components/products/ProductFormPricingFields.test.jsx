import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductFormPricingFields from "./ProductFormPricingFields.jsx";

describe("Testing ProductFormPricingFields", () => {
  const baseProps = {
    formState: {
      precio: 15000,
      stock: 20,
    },
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductFormPricingFields1: Muestra los campos de precio y stock con restricciones", () => {
    render(<ProductFormPricingFields {...baseProps} />);

    const priceInput = screen.getByLabelText("Precio (CLP)");
    const stockInput = screen.getByLabelText("Stock disponible");

    expect(priceInput).toHaveValue(15000);
    expect(priceInput).toHaveAttribute("type", "number");
    expect(priceInput).toHaveAttribute("min", "1");
    expect(stockInput).toHaveValue(20);
    expect(stockInput).toHaveAttribute("min", "0");
  });

  it("CP-ProductFormPricingFields2: Dispara onChange al modificar los valores", () => {
    render(<ProductFormPricingFields {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Precio (CLP)"), { target: { value: "18000" } });
    fireEvent.change(screen.getByLabelText("Stock disponible"), { target: { value: "15" } });

    expect(baseProps.onChange).toHaveBeenCalledTimes(2);
  });
});
