import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  formatDateTime: vi.fn((value) => `fecha:${value ?? "null"}`),
  badge: vi.fn(() => <span data-testid="badge-mock" />),
  customer: vi.fn(() => <div data-testid="customer-mock" />),
  payment: vi.fn(() => <div data-testid="payment-mock" />),
  shipping: vi.fn(() => <div data-testid="shipping-mock" />),
  totals: vi.fn(() => <div data-testid="totals-mock" />),
}));

vi.mock("@/components/orders/OrderBadge.jsx", () => ({
  __esModule: true,
  default: (props) => mocks.badge(props),
}));
vi.mock("@/components/orderDetail/OrderSummaryCustomer.jsx", () => ({
  __esModule: true,
  default: (props) => mocks.customer(props),
}));
vi.mock("@/components/orderDetail/OrderSummaryPayment.jsx", () => ({
  __esModule: true,
  default: (props) => mocks.payment(props),
}));
vi.mock("@/components/orderDetail/OrderSummaryShipping.jsx", () => ({
  __esModule: true,
  default: (props) => mocks.shipping(props),
}));
vi.mock("@/components/orderDetail/OrderSummaryTotals.jsx", () => ({
  __esModule: true,
  default: (props) => mocks.totals(props),
}));
vi.mock("@/components/orderDetail/orderSummaryUtils.js", () => ({
  __esModule: true,
  formatDateTime: mocks.formatDateTime,
}));

import OrderSummary from "./OrderSummary.jsx";

describe("Testing OrderSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mocks).forEach((mockFn) => {
      if ("mockClear" in mockFn) mockFn.mockClear();
    });
  });

  it("CP-OrderSummary1: Devuelve null cuando no hay orden", () => {
    const { container } = render(<OrderSummary order={null} />);

    expect(container.firstChild).toBeNull();
  });

  it("CP-OrderSummary2: Renderiza la información principal y delega a los subcomponentes", () => {
    const order = {
      id: "ORD-100",
      status: "processing",
      customer: "Ash",
      customerEmail: "ash@example.com",
      customerPhone: "123456",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-02T12:00:00Z",
      summary: { subtotal: 1000 },
      payment: { method: "Tarjeta" },
      shipping: { method: "Express" },
      total: 1200,
      currency: "CLP",
      notes: "Enviar con cuidado",
    };

    render(<OrderSummary order={order} />);

    expect(screen.getByText("Orden ORD-100")).toBeInTheDocument();
    expect(mocks.formatDateTime).toHaveBeenCalledWith(order.createdAt);
    expect(mocks.formatDateTime).toHaveBeenCalledWith(order.updatedAt);
    expect(screen.getByText("Enviar con cuidado")).toBeInTheDocument();
    expect(screen.getByTestId("badge-mock")).toBeInTheDocument();
    expect(screen.getByTestId("customer-mock")).toBeInTheDocument();
    expect(screen.getByTestId("payment-mock")).toBeInTheDocument();
    expect(screen.getByTestId("shipping-mock")).toBeInTheDocument();
    expect(screen.getByTestId("totals-mock")).toBeInTheDocument();
  });
});
