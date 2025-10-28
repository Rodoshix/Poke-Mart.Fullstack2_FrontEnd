import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  numberFormatter: { format: vi.fn((value) => `#${value}`) },
  currencyFormatter: { format: vi.fn((value) => `$${value}`) },
  percentFormatter: { format: vi.fn((value) => `${value}%`) },
  ReportPanel: vi.fn(({ subtitle, children }) => (
    <section data-subtitle={subtitle}>{children}</section>
  )),
}));

vi.mock("@/components/productReports/reportFormatters.js", () => ({
  __esModule: true,
  numberFormatter: hoisted.numberFormatter,
  currencyFormatter: hoisted.currencyFormatter,
  percentFormatter: hoisted.percentFormatter,
}));

vi.mock("@/components/productReports/ReportPanel.jsx", () => ({
  __esModule: true,
  default: (props) => hoisted.ReportPanel(props),
}));

import ReportFilteredProducts from "./ReportFilteredProducts.jsx";

describe("Testing ReportFilteredProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.numberFormatter.format.mockClear();
    hoisted.currencyFormatter.format.mockClear();
    hoisted.percentFormatter.format.mockClear();
    hoisted.ReportPanel.mockClear();
  });

  it("CP-ReportFilteredProducts1: Muestra mensaje vacío cuando no hay coincidencias", () => {
    render(<ReportFilteredProducts filteredProducts={[]} />);

    expect(screen.getByText("Ajusta los filtros para ver resultados.")).toBeInTheDocument();
    expect(hoisted.ReportPanel).toHaveBeenCalledWith(
      expect.objectContaining({
        subtitle: "No hay coincidencias con los filtros aplicados.",
      }),
    );
  });

  it("CP-ReportFilteredProducts2: Renderiza filas y calcula inventario", () => {
    const items = [
      {
        id: 9,
        nombre: "Hyper Potion",
        categoria: "Consumo",
        stock: 10,
        stockBase: 40,
        ratio: 0.25,
        precio: 12000,
      },
    ];

    render(<ReportFilteredProducts filteredProducts={items} />);

    expect(hoisted.numberFormatter.format).toHaveBeenCalledWith(10);
    expect(hoisted.percentFormatter.format).toHaveBeenCalledWith(0.25);
    expect(hoisted.currencyFormatter.format).toHaveBeenCalledWith(12000);
    expect(hoisted.currencyFormatter.format).toHaveBeenCalledWith(12000 * 10);
    expect(screen.getByText("Hyper Potion")).toBeInTheDocument();
  });
});
