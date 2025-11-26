// src/components/auth/AuthMenu.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

let mockSession;
let mockProfile;
vi.mock("@/hooks/useAuthSession", () => ({
  default: () => ({ session: mockSession, profile: mockProfile }),
}));

vi.mock("@/components/auth/session", () => ({
  clearAuth: vi.fn(),
}));

import { clearAuth } from "@/components/auth/session";
import AuthMenu from "./AuthMenu";

function renderWithRouter(ui) {
  return render(<MemoryRouter initialEntries={["/"]}>{ui}</MemoryRouter>);
}

describe("Testing AuthMenu", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(clearAuth).mockClear();
    mockSession = null;
    mockProfile = null;
  });

  it("CP-Auth1: Deslogueado → muestra Login/Registro y no 'Cerrar sesión'", () => {
    renderWithRouter(<AuthMenu />);

    const loginLink = screen.getByRole("link", { name: /iniciar sesión/i });
    expect(loginLink).toHaveAttribute("href", "/login");

    const regLink = screen.getByRole("link", { name: /registrar/i });
    expect(regLink).toHaveAttribute("href", "/registro");

    expect(screen.queryByRole("button", { name: /cerrar sesión/i })).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("CP-Auth2: Usuario normal → chip con inicial/nombre/email y cierra sesión", () => {
    mockSession = { token: "abc" };
    mockProfile = {
      nombre: "Ash",
      apellido: "Ketchum",
      email: "ash@poke.com",
      role: "cliente",
    };

    const { container } = renderWithRouter(<AuthMenu />);

    const avatar = container.querySelector(".auth-avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar.textContent).toBe("A");

    expect(screen.getByText("Ash Ketchum")).toBeInTheDocument();
    expect(screen.getByText("ash@poke.com")).toBeInTheDocument();

    const profileLink = screen.getByRole("link", { name: /ver y editar mi perfil/i });
    expect(profileLink).toHaveAttribute("href", "/perfil");

    const logoutBtn = screen.getByRole("button", { name: /cerrar sesión/i });
    fireEvent.click(logoutBtn);

    expect(clearAuth).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("CP-Auth3: Admin → chip clickeable que navega a /admin", () => {
    mockSession = { token: "xyz" };
    mockProfile = {
      nombre: "Prof.",
      apellido: "Oak",
      email: "oak@poke.com",
      role: "ADMIN",
    };

    renderWithRouter(<AuthMenu />);

    const adminChipBtn = screen.getByTitle("Ir al panel administrador");
    expect(adminChipBtn).toBeInTheDocument();

    fireEvent.click(adminChipBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  it("CP-Auth4: Fallback a username cuando no hay nombre/apellido", () => {
    mockSession = { token: "t" };
    mockProfile = {
      username: "misty",
      email: "misty@poke.com",
      role: "cliente",
    };

    const { container } = renderWithRouter(<AuthMenu />);

    expect(screen.getByText("misty")).toBeInTheDocument();

    const avatar = container.querySelector(".auth-avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar.textContent).toBe("M");
  });
});
