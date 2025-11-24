import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductBuyBox from "./ProductBuyBox.jsx";

vi.mock("@/utils/money", () => ({
  __esModule: true,
  money: vi.fn((value) => `$${value}`),
}));

describe("Testing ProductBuyBox", () => {
  const baseProps = {
    name: "Pikachu Plush",
    price: 19990,
    description: "Suave y adorable.",
    available: 10,
    qty: 2,
    setQty: vi.fn(),
    onAdd: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductBuyBox1: Muestra información básica del producto y stock", () => {
    render(<ProductBuyBox {...baseProps} />);

    expect(screen.getByText("Pikachu Plush")).toBeInTheDocument();
    expect(screen.getByText("$19990")).toBeInTheDocument();
    expect(screen.getByText("Suave y adorable.")).toBeInTheDocument();
    expect(screen.getByLabelText("Cantidad")).toHaveValue(2);
    expect(screen.getByText("Stock: 10")).toBeInTheDocument();
  });

  it("CP-ProductBuyBox2: Ajusta la cantidad dentro de los límites permitidos", () => {
    render(<ProductBuyBox {...baseProps} available={5} qty={3} />);

    const input = screen.getByLabelText("Cantidad");
    fireEvent.change(input, { target: { value: "10" } });
    fireEvent.change(input, { target: { value: "0" } });

    expect(baseProps.setQty).toHaveBeenNthCalledWith(1, 5);
    expect(baseProps.setQty).toHaveBeenNthCalledWith(2, 1);
  });

  it("CP-ProductBuyBox3: Deshabilita controles cuando no hay stock", () => {
    render(<ProductBuyBox {...baseProps} available={0} qty={0} />);

    expect(screen.getByLabelText("Cantidad")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
    expect(screen.getByLabelText("Cantidad")).toHaveValue(0);
  });

  it("CP-ProductBuyBox4: Ejecuta onAdd al hacer clic cuando hay stock", () => {
    render(<ProductBuyBox {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));
    expect(baseProps.onAdd).toHaveBeenCalledTimes(1);
  });

  it("CP-ProductBuyBox5: Muestra precio tachado y badge en oferta", () => {
    render(
      <ProductBuyBox
        {...baseProps}
        basePrice={10000}
        price={8000}
        offer={{ onSale: true, price: 8000, discountPct: 20 }}
      />,
    );

    expect(screen.getByText("$10000")).toBeInTheDocument();
    expect(screen.getByText("$8000")).toBeInTheDocument();
    expect(screen.getByText(/-20%/)).toBeInTheDocument();
  });
});
