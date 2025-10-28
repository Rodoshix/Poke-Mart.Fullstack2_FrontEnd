import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hooksMock = vi.hoisted(() => ({
  useAuthSession: vi.fn(),
}));

const sessionMock = vi.hoisted(() => ({
  clearAuth: vi.fn(),
}));

const itemsMock = vi.hoisted(() => [
  { to: "/admin", label: "Inicio" },
]);

const navigateMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useNavigate: () => navigateMock,
  };
});
vi.mock("@/hooks/useAuthSession.js", () => ({
  __esModule: true,
  default: hooksMock.useAuthSession,
}));
vi.mock("@/components/auth/session.js", () => ({
  __esModule: true,
  clearAuth: sessionMock.clearAuth,
}));
vi.mock("./adminSidebarNavItems.js", () => ({
  __esModule: true,
  default: itemsMock,
}));

vi.mock("./AdminSidebarBrand.jsx", () => ({
  __esModule: true,
  default: () => <div data-testid="brand" />,
}));
vi.mock("./AdminSidebarNavigation.jsx", () => ({
  __esModule: true,
  default: ({ onNavigate }) => (
    <button data-testid="nav" onClick={onNavigate}>
      Navegar
    </button>
  ),
}));
vi.mock("./AdminSidebarActions.jsx", () => ({
  __esModule: true,
  default: ({ onStoreRedirect, onLogout }) => (
    <div>
      <button data-testid="store" onClick={onStoreRedirect}>
        tienda
      </button>
      <button data-testid="logout" onClick={onLogout}>
        salir
      </button>
    </div>
  ),
}));
vi.mock("./AdminSidebarProfile.jsx", () => ({
  __esModule: true,
  default: ({ onNavigate }) => (
    <button data-testid="profile" onClick={onNavigate}>
      Perfil
    </button>
  ),
}));

import AdminSidebar from "./AdminSidebar.jsx";

const renderWithRouter = (ui) => render(<MemoryRouter initialEntries={["/admin"]}>{ui}</MemoryRouter>);

describe("Testing AdminSidebar", () => {
  const profile = {
    nombre: "Ash",
    apellido: "Ketchum",
    email: "ash@example.com",
    avatarUrl: "/avatar.png",
  };
  const onHide = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    onHide.mockReset();
    hooksMock.useAuthSession.mockReturnValue({ profile });
    navigateMock.mockClear();
  });

  it("CP-AdminSidebar1: Calcula perfil y renderiza secciones principales", () => {
    renderWithRouter(<AdminSidebar isOpen onHide={onHide} />);

    expect(screen.getByTestId("brand")).toBeInTheDocument();
    expect(screen.getByTestId("nav")).toBeInTheDocument();
    expect(screen.getByTestId("profile")).toBeInTheDocument();
  });

  it("CP-AdminSidebar2: Ejecuta onHide en acciones de navegación, tienda y logout", () => {
    renderWithRouter(<AdminSidebar isOpen onHide={onHide} />);

    fireEvent.click(screen.getByTestId("nav"));
    fireEvent.click(screen.getByTestId("store"));
    fireEvent.click(screen.getByTestId("logout"));
    fireEvent.click(screen.getByTestId("profile"));

    expect(onHide).toHaveBeenCalledTimes(4);
    expect(sessionMock.clearAuth).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenNthCalledWith(1, "/", { replace: false });
    expect(navigateMock).toHaveBeenNthCalledWith(2, "/", { replace: true });
  });

  it("CP-AdminSidebar3: Usa datos de fallback cuando no existe perfil", () => {
    hooksMock.useAuthSession.mockReturnValue({ profile: null });
    renderWithRouter(<AdminSidebar isOpen onHide={onHide} />);

    fireEvent.click(screen.getByTestId("profile"));
    expect(onHide).toHaveBeenCalled();
  });
});
