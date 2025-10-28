import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReviewItem from "./ReviewItem.jsx";

vi.mock("./stars.js", () => ({
  __esModule: true,
  starText: vi.fn(() => "★★★☆☆"),
}));

const { starText } = await import("./stars.js");

describe("Testing ReviewItem", () => {
  const baseReview = {
    id: 1,
    rating: 3,
    user: "Entrenador",
    fecha: "2024-01-15T00:00:00.000Z",
    texto: "Una reseña muy detallada",
    util: 7,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ReviewItem1: Muestra estrellas, texto y metadatos con el usuario indicado", () => {
    const dateSpy = vi
      .spyOn(Date.prototype, "toLocaleDateString")
      .mockReturnValue("15 ene 2024");

    render(<ReviewItem r={baseReview} />);

    expect(starText).toHaveBeenCalledWith(3);
    expect(screen.getByText("★★★☆☆")).toBeInTheDocument();
    expect(screen.getByText("Una reseña muy detallada")).toBeInTheDocument();
    expect(screen.getByText(/Entrenador · 15 ene 2024/)).toBeInTheDocument();

    dateSpy.mockRestore();
  });

  it("CP-ReviewItem2: Incrementa el conteo de útil y deshabilita el botón tras el clic", () => {
    const review = { ...baseReview, util: 2 };
    const dateSpy = vi
      .spyOn(Date.prototype, "toLocaleDateString")
      .mockReturnValue("15 ene 2024");

    render(<ReviewItem r={review} />);

    const button = screen.getByRole("button", { name: /es útil/i });
    const counter = screen.getByText("2");

    fireEvent.click(button);

    expect(counter).toHaveTextContent("3");
    expect(button).toBeDisabled();

    dateSpy.mockRestore();
  });

  it("CP-ReviewItem3: Usa el texto por defecto cuando no llega el usuario", () => {
    const dateSpy = vi
      .spyOn(Date.prototype, "toLocaleDateString")
      .mockReturnValue("01 feb 2024");

    render(<ReviewItem r={{ ...baseReview, user: undefined }} />);

    expect(screen.getByText(/Comprador verificado · 01 feb 2024/)).toBeInTheDocument();

    dateSpy.mockRestore();
  });
});
