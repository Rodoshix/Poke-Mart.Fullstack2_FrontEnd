import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProductBreadcrumbs from "./ProductBreadcrumbs.jsx";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing ProductBreadcrumbs", () => {
  it("CP-ProductBreadcrumbs1: Muestra la ruta completa con enlaces", () => {
    renderWithRouter(<ProductBreadcrumbs name="Pokeball" />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Productos" })).toHaveAttribute("href", "/catalogo");
    expect(screen.getByText("Pokeball")).toHaveAttribute("aria-current", "page");
  });

  it("CP-ProductBreadcrumbs2: Usa 'Detalle' como valor por defecto", () => {
    renderWithRouter(<ProductBreadcrumbs />);
    expect(screen.getByText("Detalle")).toBeInTheDocument();
  });
});
