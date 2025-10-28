import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./AdminSidebarNavItem.jsx", () => ({
  __esModule: true,
  default: vi.fn(({ label }) => <div data-testid="nav-item">{label}</div>),
}));

import AdminSidebarNavigation from "./AdminSidebarNavigation.jsx";
import AdminSidebarNavItem from "./AdminSidebarNavItem.jsx";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing AdminSidebarNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-AdminSidebarNavigation1: Renderiza cada item usando el componente de nav item", () => {
    const items = [
      { to: "/admin", label: "Inicio" },
      { to: "/admin/usuarios", label: "Usuarios" },
    ];

    renderWithRouter(<AdminSidebarNavigation items={items} onNavigate={vi.fn()} />);

    expect(AdminSidebarNavItem).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId("nav-item")).toHaveLength(2);
  });
});
