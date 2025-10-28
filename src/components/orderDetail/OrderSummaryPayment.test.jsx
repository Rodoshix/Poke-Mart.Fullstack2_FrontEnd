import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const utilsMock = vi.hoisted(() => ({
  formatDateTime: vi.fn((value) => `fecha:${value}`),
}));

vi.mock("@/components/orderDetail/orderSummaryUtils.js", () => ({
  __esModule: true,
  formatDateTime: utilsMock.formatDateTime,
}));

import OrderSummaryPayment from "./OrderSummaryPayment.jsx";

describe("Testing OrderSummaryPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    utilsMock.formatDateTime.mockClear();
  });

  it("CP-OrderSummaryPayment1: Muestra datos del pago y usa formateador de fecha", () => {
    const payment = {
      method: "Tarjeta",
      status: "Pagado",
      transactionId: "TX-99",
      capturedAt: "2024-01-10T10:00:00Z",
    };

    render(<OrderSummaryPayment payment={payment} />);

    expect(screen.getByText("Tarjeta")).toBeInTheDocument();
    expect(utilsMock.formatDateTime).toHaveBeenCalledWith(payment.capturedAt);
    expect(screen.getByText(`fecha:${payment.capturedAt}`)).toBeInTheDocument();
  });

  it("CP-OrderSummaryPayment2: Muestra valores por defecto cuando falta información", () => {
    render(<OrderSummaryPayment payment={null} />);

    expect(screen.getByText("No informado")).toBeInTheDocument();
    expect(screen.getByText("Sin estado")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("No registrado")).toBeInTheDocument();
  });
});
