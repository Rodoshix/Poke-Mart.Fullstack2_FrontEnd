import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const utilsMock = vi.hoisted(() => ({
  formatDateTime: vi.fn((value) => `fecha:${value}`),
}));

vi.mock("@/components/orderDetail/orderSummaryUtils.js", () => ({
  __esModule: true,
  formatDateTime: utilsMock.formatDateTime,
}));

import OrderSummaryShipping from "./OrderSummaryShipping.jsx";

describe("Testing OrderSummaryShipping", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    utilsMock.formatDateTime.mockClear();
  });

  it("CP-OrderSummaryShipping1: Despliega los datos de envío y la dirección completa", () => {
    const shipping = {
      method: "Express",
      carrier: "FedEx",
      trackingNumber: "TRK123",
      estimatedDelivery: "2024-02-10T12:00:00Z",
      address: {
        street: "Calle Principal 123",
        city: "Ciudad Verde",
        region: "Kanto",
        reference: "Depto 2",
        zipCode: "12345",
        country: "Chile",
      },
    };

    render(<OrderSummaryShipping shipping={shipping} />);

    expect(screen.getByText("Express")).toBeInTheDocument();
    expect(screen.getByText("FedEx")).toBeInTheDocument();
    expect(utilsMock.formatDateTime).toHaveBeenCalledWith(shipping.estimatedDelivery);
    expect(screen.getByText("Calle Principal 123")).toBeInTheDocument();
    expect(screen.getByText("CP 12345")).toBeInTheDocument();
  });

  it("CP-OrderSummaryShipping2: Muestra valores por defecto y omite dirección cuando no existe", () => {
    render(<OrderSummaryShipping shipping={null} />);

    expect(screen.getByText("Sin envío")).toBeInTheDocument();
    expect(screen.getByText("No asignado")).toBeInTheDocument();
    expect(screen.getByText("No disponible")).toBeInTheDocument();
    expect(screen.getByText("Por confirmar")).toBeInTheDocument();
    expect(screen.queryByText("Dirección de envío")).toBeNull();
  });
});
