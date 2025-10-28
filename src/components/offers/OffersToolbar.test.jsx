import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OffersToolbar from "./OffersToolbar.jsx";

describe("Testing OffersToolbar", () => {
  const baseProps = {
    sort: "best",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-OffersToolbar1: Muestra el título y la selección actual", () => {
    render(<OffersToolbar {...baseProps} />);

    expect(screen.getByRole("heading", { level: 1, name: "Ofertas" })).toBeInTheDocument();
    expect(screen.getByLabelText("Ordenar por")).toHaveValue("best");
  });

  it("CP-OffersToolbar2: Informa el cambio de orden al handler recibido", () => {
    render(<OffersToolbar {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Ordenar por"), { target: { value: "priceAsc" } });
    expect(baseProps.onChange).toHaveBeenCalledWith("priceAsc");
  });
});
