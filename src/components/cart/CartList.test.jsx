// src/components/cart/CartList.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("./CartItem", () => {
  const renderSpy = vi.fn();
  const MockCartItem = (props) => {
    renderSpy(props);
    const id = props.item?.id;
    return (
      <div data-testid="cart-item" data-id={id}>
        <button onClick={() => props.onInc(id)}>inc</button>
        <button onClick={() => props.onDec(id)}>dec</button>
        <button onClick={() => props.onChangeQty(id, "5")}>change</button>
        <button onClick={() => props.onRemove(id)}>remove</button>
      </div>
    );
  };
  return { default: MockCartItem, __renderSpy: renderSpy };
});

import { __renderSpy as cartItemSpy } from "./CartItem";
import CartList from "./CartList";

describe("Testing CartList", () => {
  beforeEach(() => {
    cartItemSpy.mockClear();
  });

  it("CP-CartList1: Estado vacío → muestra mensaje y botón 'Ir a productos' que dispara onBrowseProducts", () => {
    const onBrowseProducts = vi.fn();

    const { container } = render(
      <CartList items={[]} actions={{}} onBrowseProducts={onBrowseProducts} />
    );

    const wrapper = container.querySelector("#cartList.cart-list.card");
    expect(wrapper).toBeInTheDocument();

    expect(
      screen.getByText(/tu carrito está vacío\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/explora el catálogo y agrega tus artículos favoritos\./i)
    ).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: /ir a productos/i });
    fireEvent.click(btn);
    expect(onBrowseProducts).toHaveBeenCalledTimes(1);

    expect(screen.queryByTestId("cart-item")).toBeNull();
  });

  it("CP-CartList2: Renderiza un CartItem por cada item y pasa props correctos", () => {
    const items = [
      { id: 1, name: "Poké Ball", qty: 1, price: 500 },
      { id: 2, name: "Super Potion", qty: 2, price: 1200 },
      { id: 3, name: "Revive", qty: 1, price: 3000 },
    ];

    const actions = {
      inc: vi.fn(),
      dec: vi.fn(),
      changeQty: vi.fn(),
      remove: vi.fn(),
    };

    const { container } = render(
      <CartList items={items} actions={actions} onBrowseProducts={vi.fn()} />
    );

    const wrapper = container.querySelector("#cartList.cart-list.card");
    expect(wrapper).toBeInTheDocument();

    const rendered = screen.getAllByTestId("cart-item");
    expect(rendered).toHaveLength(3);
    expect(cartItemSpy).toHaveBeenCalledTimes(3);

    const firstCallProps = cartItemSpy.mock.calls[0][0];
    expect(firstCallProps.item).toEqual(items[0]);
    expect(firstCallProps.onInc).toBe(actions.inc);
    expect(firstCallProps.onDec).toBe(actions.dec);
    expect(firstCallProps.onChangeQty).toBe(actions.changeQty);
    expect(firstCallProps.onRemove).toBe(actions.remove);
  });

  it("CP-CartList3: Los handlers pasados a CartItem son invocables (inc/dec/change/remove)", () => {
    const items = [{ id: 42, name: "Ultra Ball", qty: 1, price: 1200 }];

    const actions = {
      inc: vi.fn(),
      dec: vi.fn(),
      changeQty: vi.fn(),
      remove: vi.fn(),
    };

    render(<CartList items={items} actions={actions} onBrowseProducts={vi.fn()} />);

    const row = screen.getByTestId("cart-item");

    fireEvent.click(screen.getByText("inc"));
    expect(actions.inc).toHaveBeenCalledWith(42);

    fireEvent.click(screen.getByText("dec"));
    expect(actions.dec).toHaveBeenCalledWith(42);

    fireEvent.click(screen.getByText("change"));
    expect(actions.changeQty).toHaveBeenCalledWith(42, "5");

    fireEvent.click(screen.getByText("remove"));
    expect(actions.remove).toHaveBeenCalledWith(42);
  });
});
