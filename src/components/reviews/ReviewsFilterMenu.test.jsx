import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReviewsFilterMenu from "./ReviewsFilterMenu.jsx";

describe("Testing ReviewsFilterMenu", () => {
  let onChange;

  beforeEach(() => {
    vi.clearAllMocks();
    onChange = vi.fn();
  });

  it("CP-ReviewsFilterMenu1: Renderiza el botón y las opciones de filtro", () => {
    render(<ReviewsFilterMenu value="all" onChange={onChange} />);

    expect(screen.getByRole("button", { name: /calificación/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /todas/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /5 estrellas/i })).toBeInTheDocument();
  });

  it("CP-ReviewsFilterMenu2: Llama a onChange con los valores esperados", () => {
    render(<ReviewsFilterMenu value="all" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /todas/i }));
    fireEvent.click(screen.getByRole("button", { name: /3 estrellas/i }));

    expect(onChange).toHaveBeenNthCalledWith(1, "all");
    expect(onChange).toHaveBeenNthCalledWith(2, "3");
  });
});
