import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminSidebarBrand from "./AdminSidebarBrand.jsx";

describe("Testing AdminSidebarBrand", () => {
  it("CP-AdminSidebarBrand1: Muestra logo y textos de la marca", () => {
    render(<AdminSidebarBrand />);

    expect(screen.getByAltText("Poké Mart")).toBeInTheDocument();
    expect(screen.getByText("Poké Mart")).toBeInTheDocument();
    expect(screen.getByText("Panel administrador")).toBeInTheDocument();
  });
});
