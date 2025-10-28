import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReviewsList from "./ReviewsList.jsx";

const reviewItemMock = vi.fn(({ r }) => <div data-testid="review-item">{r.texto}</div>);

vi.mock("./ReviewItem.jsx", () => ({
  __esModule: true,
  default: (props) => reviewItemMock(props),
}));

describe("Testing ReviewsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ReviewsList1: Muestra un mensaje cuando no hay reseñas", () => {
    render(<ReviewsList items={[]} />);

    expect(screen.getByText("No hay opiniones para este filtro.")).toBeInTheDocument();
  });

  it("CP-ReviewsList2: Renderiza cada reseña usando ReviewItem", () => {
    const items = [
      { id: 1, texto: "Excelente" },
      { id: 2, texto: "Regular" },
    ];

    render(<ReviewsList items={items} />);

    expect(reviewItemMock).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId("review-item")).toHaveLength(2);
    expect(screen.getByText("Excelente")).toBeInTheDocument();
  });
});
