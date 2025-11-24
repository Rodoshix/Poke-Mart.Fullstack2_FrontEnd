import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useProductsData from "./useProductsData.js";

vi.mock("@/services/catalogApi.js", () => ({
  __esModule: true,
  fetchProducts: vi.fn(),
}));

const { fetchProducts } = await import("@/services/catalogApi.js");

describe("useProductsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga productos y calcula oferta/precio final", async () => {
    fetchProducts.mockResolvedValue([
      { id: 1, nombre: "Poke Ball", precio: 1000, discountPct: 20 },
    ]);

    const { result } = renderHook(() => useProductsData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchProducts).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current[0].precioBase).toBe(1000);
    expect(result.current[0].precio).toBe(800); // 20% off
    expect(result.current[0].oferta.onSale).toBe(true);
    expect(result.current.error).toBe("");
  });

  it("maneja error y expone mensaje", async () => {
    fetchProducts.mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useProductsData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.length).toBe(0);
    expect(result.current.error).toMatch(/No se pudieron cargar los productos/i);
  });
});
