import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminSidebarProfile from "./AdminSidebarProfile.jsx";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing AdminSidebarProfile", () => {
  const profile = {
    name: "Ash Ketchum",
    email: "ash@example.com",
    avatar: "/avatar.png",
  };
  let onNavigate;

  beforeEach(() => {
    onNavigate = vi.fn();
  });

  it("CP-AdminSidebarProfile1: Muestra datos del perfil y llama onNavigate al hacer clic", () => {
    renderWithRouter(<AdminSidebarProfile profile={profile} onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole("link", { name: /Ash Ketchum/ }));

    expect(screen.getByAltText("Ash Ketchum")).toHaveAttribute("src", "/avatar.png");
    expect(screen.getByText("ash@example.com")).toBeInTheDocument();
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
