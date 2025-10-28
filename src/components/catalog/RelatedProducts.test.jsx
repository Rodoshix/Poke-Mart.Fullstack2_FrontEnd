// src/components/catalog/RelatedProducts.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RelatedProducts } from "./RelatedProducts";

// Mock de ProductCard (named export) para simplificar el render y contar invocaciones
vi.mock("@/components/catalog/ProductCard.jsx", () => {
  return {
    ProductCard: vi.fn(({ product }) => (
      <div data-testid="stub-related-card">{product?.nombre}</div>
    )),
  };
});

// Traemos el mock para inspeccionarlo
import { ProductCard as ProductCardMock } from "@/components/catalog/ProductCard.jsx";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Testing RelatedProducts", () => {
  it("CP-RP1: Lista vacía o no-array → muestra título y mensaje de 'Sin productos relacionados.'; no renderiza ProductCard", () => {
    const { rerender } = render(<RelatedProducts items={[]} />);
    // Título por defecto
    expect(
      screen.getByRole("heading", { level: 2, name: /productos relacionados/i })
    ).toBeInTheDocument();
    // Mensaje vacío
    expect(
      screen.getByText(/sin productos relacionados\./i)
    ).toBeInTheDocument();
    expect(ProductCardMock).not.toHaveBeenCalled();

    // Caso no-array (null)
    rerender(<RelatedProducts items={null} />);
    expect(
      screen.getByText(/sin productos relacionados\./i)
    ).toBeInTheDocument();
    expect(ProductCardMock).not.toHaveBeenCalled();
  });

  it("CP-RP2: Con items → renderiza una tarjeta por producto y usa columnas bootstrap esperadas", () => {
    const items = [
      { id: "p1", nombre: "Poción" },
      { id: "p2", nombre: "Super Ball" },
      { id: "p3", nombre: "Bicicleta" },
      { id: "p4", nombre: "GPS Poké" },
    ];

    const { container } = render(<RelatedProducts items={items} />);

    // Cards stub renderizadas
    const stubs = screen.getAllByTestId("stub-related-card");
    expect(stubs).toHaveLength(items.length);
    expect(stubs.map((n) => n.textContent)).toEqual(items.map((i) => i.nombre));

    // Se llamó ProductCard por cada item y con el product correcto
    expect(ProductCardMock).toHaveBeenCalledTimes(items.length);
    items.forEach((prod, i) => {
      expect(ProductCardMock.mock.calls[i][0]).toMatchObject({ product: prod });
    });

    // Columnas bootstrap
    const cols = container.querySelectorAll(".row.g-4 > .col-12.col-sm-6.col-lg-3.d-flex");
    expect(cols.length).toBe(items.length);
  });

  it("CP-RP3: Acepta título personalizado", () => {
    render(
      <RelatedProducts
        items={[{ id: "x", nombre: "PokéNav" }]}
        title="También te puede interesar"
      />
    );
    expect(
      screen.getByRole("heading", { level: 2, name: /también te puede interesar/i })
    ).toBeInTheDocument();
  });
});
