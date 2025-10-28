import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReviewsSummary from "./ReviewsSummary.jsx";

vi.mock("./stars.js", () => ({
  __esModule: true,
  starText: vi.fn(() => "★★★★☆"),
}));

const { starText } = await import("./stars.js");

describe("Testing ReviewsSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ReviewsSummary1: Muestra los valores promedio y utiliza starText cuando hay calificaciones", () => {
    const dist = { 5: 6, 4: 3, 3: 1, 2: 0, 1: 0 };
    render(<ReviewsSummary count={10} avg={4.3} dist={dist} />);

    expect(starText).toHaveBeenCalledWith(4.3);
    expect(screen.getByText("4.3")).toBeInTheDocument();
    expect(screen.getByLabelText("Calificación promedio")).toHaveTextContent("★★★★☆");
    const label = screen.getByText(
      (content, element) => element?.classList.contains("text-secondary") && content.includes("calificación"),
    );
    expect(label).toHaveTextContent("10 calificaciónes");
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("CP-ReviewsSummary2: Muestra marcadores vacíos si no existen reseñas", () => {
    render(<ReviewsSummary count={0} avg={0} dist={{}} />);

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByLabelText("Calificación promedio")).toHaveTextContent("☆☆☆☆☆");
    const label = screen.getByText(
      (content, element) => element?.classList.contains("text-secondary") && content.includes("calificación"),
    );
    expect(label).toHaveTextContent("0 calificaciónes");
    expect(screen.getAllByText("0%")).toHaveLength(5);
  });
});
