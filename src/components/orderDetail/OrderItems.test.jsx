import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderItems from "./OrderItems.jsx";

describe("Testing OrderItems", () => {
  it("CP-OrderItems1: Muestra mensaje vacío cuando no hay productos", () => {
    render(<OrderItems items={[]} />);

    expect(
      screen.getByText("Esta orden no tiene productos registrados."),
    ).toBeInTheDocument();
    expect(screen.getByText("0 artículos")).toBeInTheDocument();
  });

  it("CP-OrderItems2: Renderiza filas con subtotales y formato monetario", () => {
    const items = [
      { sku: "SKU-100", name: "Poción", quantity: 2, unitPrice: 1500 },
      { sku: "", name: "Pokeball", quantity: 1, unitPrice: 2500 },
    ];

    render(<OrderItems items={items} currency="CLP" />);

    expect(screen.getByText("SKU-100")).toBeInTheDocument();
    expect(screen.getByText("$1.500")).toBeInTheDocument();
    expect(screen.getByText("$3.000")).toBeInTheDocument();
    expect(screen.getAllByText("—")).toHaveLength(1);
  });
});
