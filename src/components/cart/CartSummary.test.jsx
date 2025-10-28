// src/components/cart/CartSummary.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  moneySpy: vi.fn((n) => `$${n}`),
}));
vi.mock("@/utils/money", () => ({
  money: (...args) => hoisted.moneySpy(...args),
}));

import CartSummary from "./CartSummary";

describe("Testing CartSummary", () => {
  beforeEach(() => {
    hoisted.moneySpy.mockClear();
  });

  it("CP-CS1: Envío gratis (shipping=0) → muestra 'Gratis' con .text-success y botones deshabilitados si no hay items", () => {
    const onCheckout = vi.fn();
    const onClear = vi.fn();

    const { container } = render(
      <CartSummary
        totalItems={0}
        subtotal={15000}
        shipping={0}
        total={15000}
        onCheckout={onCheckout}
        onClear={onClear}
      />
    );

    expect(screen.getByRole("heading", { level: 2, name: /resumen de compra/i })).toBeInTheDocument();

    expect(container.querySelector("#summaryItems")?.textContent).toBe("0");

    expect(hoisted.moneySpy).toHaveBeenCalledWith(15000); // subtotal
    expect(hoisted.moneySpy).toHaveBeenCalledWith(15000); // total
    expect(hoisted.moneySpy.mock.calls.filter(([v]) => v === 0).length).toBe(0);

    expect(container.querySelector("#summarySubtotal")?.textContent).toBe("$15000");
    const shippingEl = container.querySelector("#summaryShipping");
    expect(shippingEl).toBeInTheDocument();
    expect(shippingEl?.textContent).toMatch(/gratis/i);
    expect(shippingEl).toHaveClass("text-success");

    expect(container.querySelector("#summaryTotal")?.textContent).toBe("$15000");

    const checkoutBtn = screen.getByRole("button", { name: /confirmar compra/i });
    const clearBtn = screen.getByRole("button", { name: /vaciar carrito/i });
    expect(checkoutBtn).toBeDisabled();
    expect(clearBtn).toBeDisabled();

    fireEvent.click(checkoutBtn);
    fireEvent.click(clearBtn);
    expect(onCheckout).not.toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
  });

  it("CP-CS2: Envío pagado → formatea subtotal, shipping y total; botones habilitados con items", () => {
    const onCheckout = vi.fn();
    const onClear = vi.fn();

    const { container } = render(
      <CartSummary
        totalItems={3}
        subtotal={10000}
        shipping={2490}
        total={12490}
        onCheckout={onCheckout}
        onClear={onClear}
      />
    );

    expect(hoisted.moneySpy).toHaveBeenCalledWith(10000); // subtotal
    expect(hoisted.moneySpy).toHaveBeenCalledWith(2490);  // shipping
    expect(hoisted.moneySpy).toHaveBeenCalledWith(12490); // total

    expect(container.querySelector("#summarySubtotal")?.textContent).toBe("$10000");
    const shippingEl = container.querySelector("#summaryShipping");
    expect(shippingEl?.textContent).toBe("$2490");
    expect(shippingEl).not.toHaveClass("text-success");
    expect(container.querySelector("#summaryTotal")?.textContent).toBe("$12490");

    const checkoutBtn = screen.getByRole("button", { name: /confirmar compra/i });
    const clearBtn = screen.getByRole("button", { name: /vaciar carrito/i });
    expect(checkoutBtn).toBeEnabled();
    expect(clearBtn).toBeEnabled();

    fireEvent.click(checkoutBtn);
    fireEvent.click(clearBtn);
    expect(onCheckout).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("CP-CS3: canClear=false → 'Vaciar carrito' deshabilitado aunque existan items", () => {
    const onCheckout = vi.fn();
    const onClear = vi.fn();

    render(
      <CartSummary
        totalItems={2}
        subtotal={5000}
        shipping={0}
        total={5000}
        onCheckout={onCheckout}
        onClear={onClear}
        canClear={false}
      />
    );

    const checkoutBtn = screen.getByRole("button", { name: /confirmar compra/i });
    const clearBtn = screen.getByRole("button", { name: /vaciar carrito/i });

    expect(checkoutBtn).toBeEnabled();
    expect(clearBtn).toBeDisabled();

    fireEvent.click(checkoutBtn);
    fireEvent.click(clearBtn);

    expect(onCheckout).toHaveBeenCalledTimes(1);
    expect(onClear).not.toHaveBeenCalled();
  });
});
