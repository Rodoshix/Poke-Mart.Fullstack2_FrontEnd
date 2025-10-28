import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  numberFormatter: { format: vi.fn((value) => `#${value}`) },
  currencyFormatter: { format: vi.fn((value) => `$${value}`) },
  ReportPanel: vi.fn(({ children }) => <section data-testid="report-panel">{children}</section>),
}));

vi.mock("@/components/productReports/reportFormatters.js", () => ({
  __esModule: true,
  numberFormatter: hoisted.numberFormatter,
  currencyFormatter: hoisted.currencyFormatter,
}));

vi.mock("@/components/productReports/ReportPanel.jsx", () => ({
  __esModule: true,
  default: (props) => hoisted.ReportPanel(props),
}));

import ReportCategoryBreakdown from "./ReportCategoryBreakdown.jsx";

describe("Testing ReportCategoryBreakdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.numberFormatter.format.mockClear();
    hoisted.currencyFormatter.format.mockClear();
    hoisted.ReportPanel.mockClear();
  });

  it("CP-ReportCategoryBreakdown1: Muestra mensaje vacío cuando no hay categorías", () => {
    render(<ReportCategoryBreakdown categoryStats={[]} />);

    expect(screen.getByText("No hay categorías para mostrar.")).toBeInTheDocument();
    expect(hoisted.ReportPanel).toHaveBeenCalled();
  });

  it("CP-ReportCategoryBreakdown2: Renderiza filas con valores formateados", () => {
    const stats = [
      {
        name: "Pokeballs",
        products: 12,
        stock: 200,
        stockBase: 300,
        inventoryValue: 150000,
        averagePrice: 12500,
      },
    ];

    render(<ReportCategoryBreakdown categoryStats={stats} />);

    expect(screen.getByText("Pokeballs")).toBeInTheDocument();
    expect(hoisted.numberFormatter.format).toHaveBeenCalledWith(12);
    expect(hoisted.currencyFormatter.format).toHaveBeenCalledWith(150000);
    expect(screen.getByText("$150000")).toBeInTheDocument();
  });
});
