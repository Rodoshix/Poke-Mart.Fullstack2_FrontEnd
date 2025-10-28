import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import OffersEmpty from "./OffersEmpty.jsx";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing OffersEmpty", () => {
  it("CP-OffersEmpty1: Muestra mensaje informativo y enlace al catálogo", () => {
    renderWithRouter(<OffersEmpty />);

    expect(screen.getByText("Por ahora no hay productos en oferta.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir al catálogo" })).toHaveAttribute(
      "href",
      "/catalogo",
    );
  });
});
