import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  percentFormatter: { format: vi.fn((value) => `${value}%`) },
  ReportPanel: vi.fn(({ children }) => <section>{children}</section>),
}));

vi.mock("@/components/productReports/reportFormatters.js", () => ({
  __esModule: true,
  percentFormatter: hoisted.percentFormatter,
}));

vi.mock("@/components/productReports/ReportPanel.jsx", () => ({
  __esModule: true,
  default: (props) => hoisted.ReportPanel(props),
}));

import ReportRiskList from "./ReportRiskList.jsx";

describe("Testing ReportRiskList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.percentFormatter.format.mockClear();
    hoisted.ReportPanel.mockClear();
  });

  it("CP-ReportRiskList1: Muestra mensaje de stock saludable cuando no hay productos en riesgo", () => {
    render(<ReportRiskList atRisk={[]} />);

    expect(
      screen.getByText("Todos los productos filtrados presentan un stock saludable."),
    ).toBeInTheDocument();
  });

  it("CP-ReportRiskList2: Renderiza elementos con datos formateados", () => {
    const atRisk = [
      { id: 1, nombre: "Poción", categoria: "Consumo", stock: 5, stockBase: 100, ratio: 0.05 },
    ];

    render(<ReportRiskList atRisk={atRisk} />);

    expect(screen.getByText("Poción")).toBeInTheDocument();
    expect(hoisted.percentFormatter.format).toHaveBeenCalledWith(0.05);
    expect(screen.getByText("5/100")).toBeInTheDocument();
  });
});
