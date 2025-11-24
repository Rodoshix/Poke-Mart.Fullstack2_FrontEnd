import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useAdminProducts from "./useAdminProducts.js";

vi.mock("@/services/adminProductApi.js", () => ({
  __esModule: true,
  fetchAdminProducts: vi.fn(),
}));

const { fetchAdminProducts } = await import("@/services/adminProductApi.js");

describe("useAdminProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga productos admin y marca loading=false", async () => {
    fetchAdminProducts.mockResolvedValue([{ id: 10, nombre: "Item admin" }]);

    const { result } = renderHook(() => useAdminProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchAdminProducts).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBe("");
    expect(result.current[0].id).toBe(10);
  });

  it("maneja errores devolviendo lista vacia y mensaje", async () => {
    fetchAdminProducts.mockRejectedValue(new Error("api down"));

    const { result } = renderHook(() => useAdminProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.length).toBe(0);
    expect(result.current.error).toMatch(/No se pudieron cargar los productos/i);
  });
});
