import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App.jsx";

vi.mock("@/hooks/useAuthSession.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/services/orderApi.js", () => ({
  __esModule: true,
  fetchAdminOrders: vi.fn(async () => []),
}));

const useAuthSession = (await import("@/hooks/useAuthSession.js")).default;

describe("Rutas protegidas de admin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirige a login si no hay sesión", async () => {
    useAuthSession.mockReturnValue({ session: null, profile: null });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument());
  });

  it("permite acceso a admin cuando rol es admin", async () => {
    useAuthSession.mockReturnValue({ session: "token", profile: { role: "admin" } });

    render(
      <MemoryRouter initialEntries={["/admin/ordenes"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByRole("heading", { name: /Ordenes/i })).toBeInTheDocument());
  });

  it("redirige vendedor a /admin/ordenes si intenta ruta no permitida", async () => {
    useAuthSession.mockReturnValue({ session: "token", profile: { role: "vendedor" } });

    render(
      <MemoryRouter initialEntries={["/admin/resenas"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByRole("heading", { name: /Ordenes/i })).toBeInTheDocument());
  });
});
