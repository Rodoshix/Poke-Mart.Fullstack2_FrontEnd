// src/components/catalog/ProductsGrid.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductsGrid from "./ProductsGrid";

vi.mock("@/components/catalog/ProductCard.jsx", () => {
  return {
    ProductCard: vi.fn(({ product }) => (
      <div data-testid="stub-card">{product?.nombre}</div>
    )),
  };
});

import { ProductCard as ProductCardMock } from "@/components/catalog/ProductCard.jsx";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Testing ProductsGrid", () => {
  it("CP-PGrid1: Estado vacío → aria-live='polite' y muestra mensaje 'No encontramos productos.'; no renderiza ProductCard", () => {
    const { container } = render(<ProductsGrid items={[]} />);

    const grid = container.querySelector(".products__grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("aria-live", "polite");

    expect(
      screen.getByText(/no encontramos productos\./i)
    ).toBeInTheDocument();

    expect(ProductCardMock).not.toHaveBeenCalled();
  });

  it("CP-PGrid2: Renderiza una tarjeta por item con layout de columna correcto y pasa el product al ProductCard", () => {
    const items = [
      { id: "p1", nombre: "Poción" },
      { id: "p2", nombre: "Super Ball" },
      { id: "p3", nombre: "Bicicleta" },
    ];

    const { container } = render(<ProductsGrid items={items} />);

    const stubs = screen.getAllByTestId("stub-card");
    expect(stubs).toHaveLength(items.length);
    expect(stubs.map((el) => el.textContent)).toEqual(
      items.map((i) => i.nombre)
    );

    const cols = container.querySelectorAll(
      ".col-12.col-sm-6.col-lg-3.d-flex"
    );
    expect(cols.length).toBe(items.length);

    expect(ProductCardMock).toHaveBeenCalledTimes(items.length);
    expect(ProductCardMock.mock.calls[0][0]).toMatchObject({ product: items[0] });
    expect(ProductCardMock.mock.calls[1][0]).toMatchObject({ product: items[1] });
    expect(ProductCardMock.mock.calls[2][0]).toMatchObject({ product: items[2] });
  });

  it("CP-PGrid3: Con items no debe mostrar el mensaje de vacío", () => {
    const items = [{ id: "p1", nombre: "Poción" }];
    render(<ProductsGrid items={items} />);

    expect(
      screen.queryByText(/no encontramos productos\./i)
    ).not.toBeInTheDocument();
  });
});
