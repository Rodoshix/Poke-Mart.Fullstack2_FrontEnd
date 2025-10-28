import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Reviews } from "./Reviews.jsx";

const useReviewsDataMock = vi.fn();
const summaryMock = vi.fn(() => <div data-testid="reviews-summary-mock" />);
const filterMenuMock = vi.fn(({ onChange }) => (
  <button data-testid="reviews-filter-mock" onClick={() => onChange("4")} />
));
const listMock = vi.fn(({ items }) => (
  <div data-testid="reviews-list-mock">{items.length}</div>
));

vi.mock("@/hooks/useReviewsData", () => ({
  __esModule: true,
  useReviewsData: (...args) => useReviewsDataMock(...args),
}));

vi.mock("./ReviewsSummary.jsx", () => ({
  __esModule: true,
  default: (props) => summaryMock(props),
}));

vi.mock("./ReviewsFilterMenu.jsx", () => ({
  __esModule: true,
  default: (props) => filterMenuMock(props),
}));

vi.mock("./ReviewsList.jsx", () => ({
  __esModule: true,
  default: (props) => listMock(props),
}));

describe("Testing Reviews", () => {
  const reviews = [{ id: 1 }, { id: 2 }];
  const baseHookValue = {
    count: 2,
    avg: 4.5,
    dist: { 5: 1, 4: 1 },
    filter: "all",
    setFilter: vi.fn(),
    filtered: reviews,
    showMissingBanner: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useReviewsDataMock.mockReturnValue(baseHookValue);
  });

  it("CP-Reviews1: Renderiza resumen, menú de filtros y lista con los datos entregados por el hook", () => {
    render(<Reviews reviews={reviews} productId={10} reviewsDict={{}} />);

    expect(useReviewsDataMock).toHaveBeenCalledWith({ reviews, productId: 10, reviewsDict: {} });
    expect(summaryMock).toHaveBeenCalledWith(
      expect.objectContaining({ count: 2, avg: 4.5, dist: { 5: 1, 4: 1 } }),
    );
    expect(filterMenuMock).toHaveBeenCalledWith(
      expect.objectContaining({ value: "all", onChange: baseHookValue.setFilter }),
    );
    expect(listMock).toHaveBeenCalledWith(expect.objectContaining({ items: reviews }));
  });

  it("CP-Reviews2: Muestra el banner de advertencia y permite cambiar el filtro", () => {
    const hookData = { ...baseHookValue, showMissingBanner: true };
    useReviewsDataMock.mockReturnValue(hookData);

    render(<Reviews reviews={reviews} productId={999} reviewsDict={{}} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      /No hay reseñas en reviews\.json.*999/,
    );

    fireEvent.click(screen.getByTestId("reviews-filter-mock"));

    expect(hookData.setFilter).toHaveBeenCalledWith("4");
  });
});
