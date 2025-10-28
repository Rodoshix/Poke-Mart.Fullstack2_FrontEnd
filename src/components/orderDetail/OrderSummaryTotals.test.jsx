import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const utilsMock = vi.hoisted(() => ({
  formatCurrency: vi.fn((value, currency) => `${currency}:${value}`),
}));

vi.mock("@/components/orderDetail/orderSummaryUtils.js", () => ({
  __esModule: true,
  formatCurrency: utilsMock.formatCurrency,
}));

import OrderSummaryTotals from "./OrderSummaryTotals.jsx";

describe("Testing OrderSummaryTotals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    utilsMock.formatCurrency.mockClear();
  });

  it("CP-OrderSummaryTotals1: Formatea todos los valores y muestra descuento cuando existe", () => {
    const summary = {
      subtotal: 20000,
      shipping: 3000,
      discount: 500,
      total: 22500,
      taxes: 3600,
    };

    render(<OrderSummaryTotals summary={summary} total={summary.total} currency="CLP" />);

    expect(utilsMock.formatCurrency).toHaveBeenCalledWith(20000, "CLP");
    expect(screen.getByText("CLP:20000")).toBeInTheDocument();
    expect(screen.getByText("-CLP:500")).toBeInTheDocument();
    expect(screen.getByText("CLP:22500")).toBeInTheDocument();
    expect(screen.getByText("CLP:3600")).toBeInTheDocument();
  });

  it("CP-OrderSummaryTotals2: Omite descuento y usa total alternativo cuando falta summary.total", () => {
    const summary = { subtotal: 10000, shipping: 0, taxes: 1900 };

    render(<OrderSummaryTotals summary={summary} total={12000} currency="USD" />);

    expect(screen.queryByText(/Descuentos/)).toBeNull();
    expect(utilsMock.formatCurrency).toHaveBeenCalledWith(12000, "USD");
  });
});
