import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCheckoutForm } from "./useCheckoutForm.js";

vi.mock("@/components/auth/session", () => ({
  __esModule: true,
  getAuth: vi.fn(),
  getProfile: vi.fn(),
}));

const { getAuth, getProfile } = await import("@/components/auth/session");

describe("useCheckoutForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prefill con datos de perfil cuando hay sesión", async () => {
    getAuth.mockReturnValue({ token: "t" });
    getProfile.mockReturnValue({
      nombre: "Ash",
      apellido: "Ketchum",
      email: "ash@poke.com",
      calle: "Ruta 1",
      region: "Kanto",
      comuna: "Pueblo Paleta",
    });

    const { result } = renderHook(() => useCheckoutForm());

    await waitFor(() => expect(result.current.form.nombre).toBe("Ash"));
    expect(result.current.form.apellido).toBe("Ketchum");
    expect(result.current.form.email).toBe("ash@poke.com");
    expect(result.current.form.region).toBe("Kanto");
    expect(result.current.form.comuna).toBe("Pueblo Paleta");
  });

  it("valida campos requeridos", () => {
    getAuth.mockReturnValue(null);
    getProfile.mockReturnValue(null);
    const { result } = renderHook(() => useCheckoutForm());

    act(() => result.current.resetForm());

    const errors = result.current.validate();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((msg) => msg.includes("nombre"))).toBe(true);
    expect(errors.some((msg) => msg.toLowerCase().includes("correo"))).toBe(true);
  });

  it("setRegion ajusta la comuna cuando no coincide", async () => {
    getAuth.mockReturnValue(null);
    getProfile.mockReturnValue(null);
    const { result } = renderHook(() => useCheckoutForm());

    act(() => {
      result.current.setField("region", "Kanto");
      result.current.setField("comuna", "Ciudad Central");
    });

    act(() => result.current.setRegion("Hoenn"));

    expect(result.current.form.region).toBe("Hoenn");
    expect(result.current.form.comuna).toBe("Ciudad Portual");
  });
});
