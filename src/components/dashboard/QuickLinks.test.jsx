import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import QuickLinks from "./QuickLinks.jsx";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing QuickLinks", () => {
  it("CP-QuickLinks1: Devuelve null cuando no hay enlaces válidos", () => {
    const { container } = renderWithRouter(<QuickLinks links={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("CP-QuickLinks2: Renderiza cada enlace con icono y descripción", () => {
    const links = [
      { id: "a", to: "/admin/usuarios", title: "Usuarios", description: "Gestiona usuarios", icon: "👤" },
      { id: "b", to: "/admin/ordenes", title: "Órdenes", description: "Revisa pedidos", icon: null },
    ];

    renderWithRouter(<QuickLinks links={links} />);

    expect(screen.getByRole("link", { name: "Usuarios Gestiona usuarios" })).toHaveAttribute(
      "href",
      "/admin/usuarios",
    );
    expect(screen.getByText("👤")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Órdenes")).toBeInTheDocument();
  });
});
