import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AdminSidebarNavItem from "./AdminSidebarNavItem.jsx";

const renderWithRouter = (ui, initialEntries = ["/"]) =>
  render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);

describe("Testing AdminSidebarNavItem", () => {
  it("CP-AdminSidebarNavItem1: Renderiza NavLink con etiqueta y dispara onNavigate", () => {
    const onNavigate = vi.fn();
    renderWithRouter(
      <AdminSidebarNavItem
        to="/admin"
        label="Dashboard"
        code="🏠"
        onNavigate={onNavigate}
      />,
    );

    expect(screen.getByRole("link", { name: /Dashboard/ })).toHaveAttribute("href", "/admin");
    expect(screen.getByText("🏠")).toHaveAttribute("aria-hidden", "true");
    fireEvent.click(screen.getByRole("link", { name: /Dashboard/ }));
    expect(onNavigate).toHaveBeenCalled();
  });
});
