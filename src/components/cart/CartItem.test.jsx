// src/components/cart/CartItem.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CartItem from "./CartItem";

const moneyLike = /\$\s*[\d.]+/; // evita flakiness por locale

describe("Testing CartItem", () => {
  let onInc, onDec, onChangeQty, onRemove;

  beforeEach(() => {
    onInc = vi.fn();
    onDec = vi.fn();
    onChangeQty = vi.fn();
    onRemove = vi.fn();
  });

  it("CP-CartItem1: Render básico + formateos CLP + qty controls + subtotal", () => {
    const item = {
      id: 7,
      name: "Super Ball",
      image: "/img/super-ball.png",
      price: 1500,
      qty: 2,
      stock: 5,
    };

    const { container } = render(
      <CartItem
        item={item}
        onInc={onInc}
        onDec={onDec}
        onChangeQty={onChangeQty}
        onRemove={onRemove}
      />
    );

    const img = container.querySelector("img.cart-item__img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/img/super-ball.png");
    expect(img).toHaveAttribute("alt", "Super Ball");

    const titleEl = container.querySelector(".cart-item__title");
    expect(titleEl).not.toBeNull();
    expect(titleEl.textContent).toBe("Super Ball");

    const unitPrice = container.querySelector(".text-primary.fw-semibold");
    expect(unitPrice).not.toBeNull();
    expect(unitPrice.textContent).toMatch(moneyLike);

    const meta = container.querySelector(".cart-item__meta");
    expect(meta).not.toBeNull();
    expect(meta).toHaveTextContent("Stock disponible: 5");

    const decBtn = screen.getByRole("button", { name: /disminuir/i });
    const incBtn = screen.getByRole("button", { name: /aumentar/i });
    const qtyInput = container.querySelector("input.qty__value");
    expect(qtyInput).not.toBeNull();
    expect(qtyInput).toHaveAttribute("type", "number");
    expect(qtyInput).toHaveAttribute("min", "1");
    expect(qtyInput).toHaveAttribute("max", "5");
    expect(qtyInput).toHaveValue(2);

    fireEvent.click(decBtn);
    expect(onDec).toHaveBeenCalledWith(7);

    fireEvent.click(incBtn);
    expect(onInc).toHaveBeenCalledWith(7);

    fireEvent.change(qtyInput, { target: { value: "4" } });
    expect(onChangeQty).toHaveBeenCalledWith(7, "4");

    const subtotal = container.querySelector(".cart-item__price .fw-semibold.mb-1");
    expect(subtotal).not.toBeNull();
    expect(subtotal.textContent).toMatch(moneyLike);

    const removeBtn = screen.getByRole("button", { name: /eliminar/i });
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith(7);
  });

  it("CP-CartItem2: Oferta aplicada muestra base tachado, precio con descuento y %", () => {
    const item = {
      id: 9,
      name: "Hyper Potion",
      image: "/img/hyper.png",
      price: 8000,
      qty: 1,
      stock: 10,
      _offer: { base: 10000, price: 8000, discountPct: 20 },
    };

    const { container } = render(
      <CartItem
        item={item}
        onInc={onInc}
        onDec={onDec}
        onChangeQty={onChangeQty}
        onRemove={onRemove}
      />
    );

    const offerRow = container.querySelector(".text-success");
    expect(offerRow).not.toBeNull();
    expect(offerRow).toHaveTextContent(/oferta aplicada/i);

    const baseDel = container.querySelector("del.text-muted.me-1");
    expect(baseDel).not.toBeNull();
    expect(baseDel.textContent).toMatch(moneyLike);

    expect(offerRow.textContent).toMatch(moneyLike);
    expect(offerRow.textContent).toMatch(/-20%/);
  });

  it("CP-CartItem3: Si stock no es finito → max = qty", () => {
    const item = {
      id: 3,
      name: "Max Revive",
      image: "/img/maxrevive.png",
      price: 5000,
      qty: 3,
      stock: undefined,
    };

    const { container } = render(
      <CartItem
        item={item}
        onInc={onInc}
        onDec={onDec}
        onChangeQty={onChangeQty}
        onRemove={onRemove}
      />
    );

    const meta = container.querySelector(".cart-item__meta");
    expect(meta).not.toBeNull();
    expect(meta).toHaveTextContent("Stock disponible: 3");

    const qtyInput = container.querySelector("input.qty__value");
    expect(qtyInput).not.toBeNull();
    expect(qtyInput).toHaveAttribute("max", "3");
  });

  it("CP-CartItem4: onError de imagen → usa FALLBACK_IMAGE", () => {
    const item = {
      id: 1,
      name: "Poké Ball",
      image: "/img/404.png",
      price: 500,
      qty: 1,
      stock: 1,
    };

    const { container } = render(
      <CartItem
        item={item}
        onInc={onInc}
        onDec={onDec}
        onChangeQty={onChangeQty}
        onRemove={onRemove}
      />
    );

    const img = container.querySelector("img.cart-item__img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/img/404.png");

    fireEvent.error(img);
    expect(img).toHaveAttribute("src", "/src/assets/img/tienda/productos/poke-Ball.png");
  });
});
