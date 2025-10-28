import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const formatterMocks = vi.hoisted(() => ({
  numberFormatter: { format: vi.fn((value) => `#${value}`) },
  currencyFormatter: { format: vi.fn((value) => `$${value}`) },
}));

vi.mock("@/components/productReports/reportFormatters.js", () => ({
  __esModule: true,
  numberFormatter: formatterMocks.numberFormatter,
  currencyFormatter: formatterMocks.currencyFormatter,
}));

import ReportSummaryCards from "./ReportSummaryCards.jsx";

describe("Testing ReportSummaryCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    formatterMocks.numberFormatter.format.mockClear();
    formatterMocks.currencyFormatter.format.mockClear();
  });

  it("CP-ReportSummaryCards1: Muestra los valores formateados por los helpers", () => {
    const summary = {
      totalProducts: 120,
      totalCategories: 8,
      totalStock: 350,
      totalStockValue: 999000,
      totalAtRisk: 25,
      totalCritical: 5,
    };

    render(<ReportSummaryCards summary={summary} />);

    expect(formatterMocks.numberFormatter.format).toHaveBeenCalledWith(120);
    expect(formatterMocks.numberFormatter.format).toHaveBeenCalledWith(8);
    expect(formatterMocks.currencyFormatter.format).toHaveBeenCalledWith(999000);
    expect(screen.getByText("#120")).toBeInTheDocument();
    expect(screen.getByText("#8")).toBeInTheDocument();
    expect(screen.getByText("#350")).toBeInTheDocument();
    expect(screen.getByText("$999000 en vitrina")).toBeInTheDocument();
    expect(screen.getByText("#25")).toBeInTheDocument();
    expect(screen.getByText("#5 críticos")).toBeInTheDocument();
  });

  it("CP-ReportSummaryCards2: Usa ceros cuando los datos están indefinidos", () => {
    render(<ReportSummaryCards summary={{}} />);

    expect(formatterMocks.numberFormatter.format).toHaveBeenCalledWith(0);
    expect(formatterMocks.currencyFormatter.format).toHaveBeenCalledWith(0);
  });
});
