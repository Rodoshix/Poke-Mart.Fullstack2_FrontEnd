import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLogin } from "./useLogin.js";

vi.mock("@/services/authService.js", () => ({
  __esModule: true,
  login: vi.fn(),
}));

vi.mock("@/components/auth/session", () => ({
  __esModule: true,
  setAuth: vi.fn(),
  getAuth: vi.fn(() => null),
  getProfile: vi.fn(() => null),
}));

const { login } = await import("@/services/authService.js");
const { setAuth } = await import("@/components/auth/session");

describe("useLogin", () => {
  const navigate = vi.fn();
  const params = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("valida campos requeridos antes de llamar al API", () => {
    const { result } = renderHook(() => useLogin({ navigate, params }));

    act(() => {
      result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(result.current.error).toMatch(/Ingresa usuario/i);
    expect(login).not.toHaveBeenCalled();
  });

  it("hace login y navega segun rol admin", async () => {
    login.mockResolvedValue({
      token: "t",
      refreshToken: "r",
      expiresAt: 123,
      profile: { role: "ADMIN", email: "admin@poke" },
    });

    const { result } = renderHook(() => useLogin({ navigate, params }));

    act(() => {
      result.current.setUsername("admin");
      result.current.setPassword("secret");
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(login).toHaveBeenCalledWith({ identifier: "admin", password: "secret" });
    expect(setAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        token: "t",
        refreshToken: "r",
        profile: expect.objectContaining({ role: "admin" }),
      }),
    );
    expect(navigate).toHaveBeenCalledWith("/admin", { replace: true });
  });
});
