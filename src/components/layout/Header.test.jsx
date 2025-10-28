import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "./Header.jsx";

const hoisted = vi.hoisted(() => ({
  getCount: vi.fn(),
  getAuth: vi.fn(),
  getProfile: vi.fn(),
  showCartGuardModal: vi.fn(),
  CartGuardModal: vi.fn(() => <div data-testid="cart-guard-modal" />),
  AuthMenu: vi.fn(() => <div data-testid="auth-menu" />),
  navigate: vi.fn(),
}));

vi.mock("@/components/auth/AuthMenu.jsx", () => ({
  __esModule: true,
  default: () => hoisted.AuthMenu(),
}));

vi.mock("@/components/auth/session.js", () => ({
  __esModule: true,
  getAuth: () => hoisted.getAuth(),
  getProfile: () => hoisted.getProfile(),
}));

vi.mock("@/components/auth/CartGuardModal.jsx", () => ({
  __esModule: true,
  showCartGuardModal: (...args) => hoisted.showCartGuardModal(...args),
  CartGuardModal: (props) => hoisted.CartGuardModal(props),
}));

vi.mock("@/lib/cartStore", () => ({
  __esModule: true,
  getCount: () => hoisted.getCount(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useNavigate: () => hoisted.navigate,
  };
});

const renderHeader = () => render(<MemoryRouter><Header /></MemoryRouter>);

describe("Testing Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.navigate.mockClear();
  });

  it("CP-Header1: Renderiza enlaces y actualiza el contador del carrito", () => {
    let count = 3;
    hoisted.getCount.mockImplementation(() => count);
    hoisted.getAuth.mockReturnValue(null);
    hoisted.getProfile.mockReturnValue(null);

    renderHeader();

    const cartButton = screen.getByRole("button", { name: "Ver carrito" });
    expect(cartButton.querySelector("#cartCount")).toHaveTextContent("3");
    expect(screen.getByRole("link", { name: "Productos" })).toHaveAttribute("href", "/catalogo");

    count = 10;
    act(() => {
      window.dispatchEvent(new Event("cart:updated"));
    });

    expect(cartButton.querySelector("#cartCount")).toHaveTextContent("10");
  });

  it("CP-Header2: Bloquea acceso al carrito cuando no hay sesión válida", () => {
    hoisted.getCount.mockReturnValue(0);
    hoisted.getAuth.mockReturnValue(null);
    hoisted.getProfile.mockReturnValue(null);

    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: "Ver carrito" }));

    expect(hoisted.showCartGuardModal).toHaveBeenCalledTimes(1);
    expect(hoisted.navigate).not.toHaveBeenCalled();
  });

  it("CP-Header3: Navega al carrito cuando el usuario está autorizado", () => {
    hoisted.getCount.mockReturnValue(2);
    hoisted.getAuth.mockReturnValue({ token: "abc" });
    hoisted.getProfile.mockReturnValue({ role: "cliente" });

    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: "Ver carrito" }));

    expect(hoisted.navigate).toHaveBeenCalledWith("/carrito");
    expect(hoisted.showCartGuardModal).not.toHaveBeenCalled();
  });
});
