import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useOrdersData from "./useOrdersData.js";

vi.mock("@/services/orderApi.js", () => ({
  __esModule: true,
  fetchAdminOrders: vi.fn(),
}));

const { fetchAdminOrders } = await import("@/services/orderApi.js");

describe("useOrdersData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga ordenes exitosamente", async () => {
    fetchAdminOrders.mockResolvedValue([{ id: "ORD-1" }]);

    const { result } = renderHook(() => useOrdersData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchAdminOrders).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBe("");
    expect(result.current[0].id).toBe("ORD-1");
  });

  it("propaga error y deja lista vacia", async () => {
    fetchAdminOrders.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useOrdersData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.length).toBe(0);
    expect(result.current.error).toMatch(/No se pudieron cargar las ordenes/i);
  });
});
