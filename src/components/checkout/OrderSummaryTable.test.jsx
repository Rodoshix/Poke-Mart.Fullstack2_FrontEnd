// src/components/checkout/OrderSummaryTable.test.jsx
import { render, screen, within, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/utils/money", () => ({
  money: (n) => `$${n}`,
}));

import OrderSummaryTable from "./OrderSummaryTable";

describe("Testing OrderSummaryTable", () => {
  it("CP-OSum1: Estado vacío → muestra mensaje y no renderiza la tabla", () => {
    render(<OrderSummaryTable items={[]} subtotal={0} shipping={0} total={0} />);

    expect(screen.getByText(/resumen del pedido/i)).toBeInTheDocument();
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("CP-OSum2: Renderiza filas por ítem y muestra precios/subtotales y 'Gratis' cuando shipping = 0", () => {
    const items = [
      { id: 1, image: "/img/pokeball.png", name: "Poké Ball", price: 1000, qty: 2 },
      { id: 2, image: "/img/superball.png", name: "Super Ball", price: 2000, qty: 1 },
    ];
    const subtotal = 1000 * 2 + 2000 * 1;
    const shipping = 0;
    const total = subtotal + shipping;
  
    const { container } = render(
      <OrderSummaryTable items={items} subtotal={subtotal} shipping={shipping} total={total} />
    );
  
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  
    const thead = within(container.querySelector("thead"));
    expect(thead.getByText(/imagen/i)).toBeInTheDocument();
    expect(thead.getByText(/nombre/i)).toBeInTheDocument();
    expect(thead.getByText(/precio/i)).toBeInTheDocument();
    expect(thead.getByText(/cantidad/i)).toBeInTheDocument();
    expect(thead.getByText(/subtotal/i)).toBeInTheDocument();
  
    const tbody = container.querySelector("tbody");
    const bodyRows = within(tbody).getAllByRole("row");
    expect(bodyRows).toHaveLength(2);
  
    expect(screen.getByAltText("Poké Ball")).toBeInTheDocument();
    expect(screen.getByAltText("Super Ball")).toBeInTheDocument();
    expect(screen.getByText("Poké Ball")).toBeInTheDocument();
    expect(screen.getByText("Super Ball")).toBeInTheDocument();

    const tfoot = container.querySelector("tfoot");
    const [rowSubtotal, rowEnvio, rowTotal] = within(tfoot).getAllByRole("row");
  
    expect(within(rowSubtotal).getByText(/subtotal/i)).toBeInTheDocument();
    expect(within(rowSubtotal).getByText("$4000")).toBeInTheDocument();
  
    expect(within(rowEnvio).getByText(/envío/i)).toBeInTheDocument();
    expect(within(rowEnvio).getByText(/gratis/i)).toBeInTheDocument();
  
    expect(within(rowTotal).getByText(/total/i)).toBeInTheDocument();
    expect(within(rowTotal).getByText("$4000")).toBeInTheDocument();
  });


  it("CP-OSum3: Con shipping > 0 muestra el monto formateado en vez de 'Gratis'", () => {
    const items = [{ id: 1, image: "/img/pokeball.png", name: "Poké Ball", price: 1000, qty: 1 }];
    const subtotal = 1000;
    const shipping = 1500;
    const total = subtotal + shipping;

    const { container } = render(
      <OrderSummaryTable items={items} subtotal={subtotal} shipping={shipping} total={total} />
    );

    const tfoot = container.querySelector("tfoot");
    const tf = within(tfoot);
    expect(tf.getByText("$1500")).toBeInTheDocument();
    expect(tf.getByText("$2500")).toBeInTheDocument();
  });

  it("CP-OSum4: Fallback de imagen al disparar onError → cambia al placeholder", () => {
    const broken = { id: 9, image: "/img/no-existe.png", name: "Item roto", price: 500, qty: 1 };
    render(<OrderSummaryTable items={[broken]} subtotal={500} shipping={0} total={500} />);

    const img = screen.getByAltText("Item roto");
    expect(img).toBeInTheDocument();
    fireEvent.error(img);
    expect(img.getAttribute("src") || "").toMatch(/poke-Ball\.png$/);
  });
});
