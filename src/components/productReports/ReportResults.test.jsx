import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const SummaryMock = vi.fn(() => <div data-testid="summary-mock" />);
const CategoryMock = vi.fn(() => <div data-testid="category-mock" />);
const RiskMock = vi.fn(() => <div data-testid="risk-mock" />);
const FilteredMock = vi.fn(() => <div data-testid="filtered-mock" />);

vi.mock("@/components/productReports/ReportSummaryCards.jsx", () => ({
  __esModule: true,
  default: (props) => SummaryMock(props),
}));
vi.mock("@/components/productReports/ReportCategoryBreakdown.jsx", () => ({
  __esModule: true,
  default: (props) => CategoryMock(props),
}));
vi.mock("@/components/productReports/ReportRiskList.jsx", () => ({
  __esModule: true,
  default: (props) => RiskMock(props),
}));
vi.mock("@/components/productReports/ReportFilteredProducts.jsx", () => ({
  __esModule: true,
  default: (props) => FilteredMock(props),
}));

import ReportResults from "./ReportResults.jsx";

describe("Testing ReportResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ReportResults1: Renderiza todas las secciones con los datos entregados", () => {
    const summary = { totalProducts: 1 };
    const categoryStats = [{ name: "Pokeballs" }];
    const atRisk = [{ id: 1 }];
    const filteredProducts = [{ id: 99 }];

    render(
      <ReportResults
        summary={summary}
        categoryStats={categoryStats}
        atRisk={atRisk}
        filteredProducts={filteredProducts}
      />,
    );

    expect(SummaryMock).toHaveBeenCalledWith(
      expect.objectContaining({ summary }),
    );
    expect(CategoryMock).toHaveBeenCalledWith(expect.objectContaining({ categoryStats }));
    expect(RiskMock).toHaveBeenCalledWith(expect.objectContaining({ atRisk }));
    expect(FilteredMock).toHaveBeenCalledWith(expect.objectContaining({ filteredProducts }));

    expect(screen.getByTestId("summary-mock")).toBeInTheDocument();
    expect(screen.getByTestId("category-mock")).toBeInTheDocument();
    expect(screen.getByTestId("risk-mock")).toBeInTheDocument();
    expect(screen.getByTestId("filtered-mock")).toBeInTheDocument();
  });

  it("CP-ReportResults2: Usa arreglos vacíos por defecto cuando faltan props", () => {
    render(<ReportResults summary={{}} />);

    expect(CategoryMock).toHaveBeenCalledWith(
      expect.objectContaining({ categoryStats: [] }),
    );
    expect(RiskMock).toHaveBeenCalledWith(expect.objectContaining({ atRisk: [] }));
    expect(FilteredMock).toHaveBeenCalledWith(expect.objectContaining({ filteredProducts: [] }));
  });
});
