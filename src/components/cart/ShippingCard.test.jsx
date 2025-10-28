// src/components/cart/ShippingCard.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  moneySpy: vi.fn((n) => `$${n}`),
}));
vi.mock("@/utils/money", () => ({
  money: (...args) => hoisted.moneySpy(...args),
}));

import ShippingCard from "./ShippingCard";

describe("Testing ShippingCard", () => {
  beforeEach(() => {
    hoisted.moneySpy.mockClear();
  });

  it("CP-Ship1: Envío gratis cuando subtotal >= threshold (muestra 'Gratis', barra 100%, mensaje gratis)", () => {
    const { container } = render(
      <ShippingCard subtotal={20000} threshold={15000} cost={2490} />
    );

    expect(screen.getByText(/^Envío$/)).toBeInTheDocument();

    const amountEl = screen.getByText(/^gratis$/i);
    expect(amountEl).toBeInTheDocument();
    expect(amountEl).toHaveClass("fw-semibold", "text-success");

    const bar = container.querySelector(".progress-bar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveStyle({ width: "100%" });

    expect(
      screen.getByText(/ya cuentas con envío gratis en esta compra\./i)
    ).toBeInTheDocument();

    const calledWithCost = hoisted.moneySpy.mock.calls.some(([v]) => v === 2490);
    const calledWithMissing = hoisted.moneySpy.mock.calls.some(([v]) => v === 0);
    expect(calledWithCost).toBe(false);
    expect(calledWithMissing).toBe(false);
  });

  it("CP-Ship2: Envío pagado (subtotal < threshold): formatea cost y missing; barra según porcentaje redondeado", () => {
    const { container } = render(
      <ShippingCard subtotal={2500} threshold={10000} cost={2990} />
    );

    const amountEl = screen.getByText("$2990");
    expect(amountEl).toBeInTheDocument();
    expect(amountEl).toHaveClass("fw-semibold");
    expect(amountEl).not.toHaveClass("text-success");

    const missing = 10000 - 2500;
    expect(hoisted.moneySpy).toHaveBeenCalledWith(2990);
    expect(hoisted.moneySpy).toHaveBeenCalledWith(missing);

    const bar = container.querySelector(".progress-bar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveStyle({ width: "25%" });

    expect(
      screen.getByText(/agrega \$7500 para obtener envío gratis\./i)
    ).toBeInTheDocument();
  });

  it("CP-Ship3: Borde cercano (subtotal=threshold-1) → no gratis, pero barra llega a 100% y missing=1", () => {
    const { container } = render(
      <ShippingCard subtotal={9999} threshold={10000} cost={2490} />
    );

    expect(screen.getByText("$2490")).toBeInTheDocument();
    expect(hoisted.moneySpy).toHaveBeenCalledWith(2490);

    const bar = container.querySelector(".progress-bar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveStyle({ width: "100%" });

    expect(hoisted.moneySpy).toHaveBeenCalledWith(1);
    expect(
      screen.getByText(/agrega \$1 para obtener envío gratis\./i)
    ).toBeInTheDocument();
  });
});
