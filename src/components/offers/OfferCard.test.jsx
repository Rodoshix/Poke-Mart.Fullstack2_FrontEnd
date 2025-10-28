import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  money: vi.fn((value) => `$${value}`),
  countdown: vi.fn((ms) => `${ms}ms`),
}));

vi.mock("@/utils/money", () => ({
  __esModule: true,
  money: hoisted.money,
}));

vi.mock("@/lib/offers", () => ({
  __esModule: true,
  countdown: hoisted.countdown,
}));

import OfferCard from "./OfferCard.jsx";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing OfferCard", () => {
  const baseProduct = {
    id: 1,
    nombre: "Pikachu Plush",
    stock: 5,
    img: "/img/pika.png",
    offer: {
      price: 9990,
      basePrice: 14990,
      discountPct: 33,
      expiresInMs: 60000,
    },
  };
  const onAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.money.mockClear();
    hoisted.countdown.mockClear();
    onAdd.mockClear();
  });

  it("CP-OfferCard1: Renderiza precios, badge y contador cuando corresponde", () => {
    renderWithRouter(<OfferCard product={baseProduct} onAdd={onAdd} />);

    expect(hoisted.money).toHaveBeenCalledWith(baseProduct.offer.price);
    expect(hoisted.money).toHaveBeenCalledWith(baseProduct.offer.basePrice);
    expect(screen.getByText("-33%")).toBeInTheDocument();
    expect(hoisted.countdown).toHaveBeenCalledWith(60000);
    expect(screen.getByText("Termina en 60000ms")).toBeInTheDocument();
  });

  it("CP-OfferCard2: Llama a onAdd al añadir y navega al detalle", () => {
    renderWithRouter(<OfferCard product={baseProduct} onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: /Añadir/i }));
    expect(onAdd).toHaveBeenCalledWith(baseProduct);
    expect(screen.getByRole("link", { name: "Ver detalle" })).toHaveAttribute(
      "href",
      "/producto/1",
    );
  });

  it("CP-OfferCard3: Maneja falta de stock y caída de imagen", () => {
    renderWithRouter(
      <OfferCard
        product={{ ...baseProduct, stock: 0, offer: { ...baseProduct.offer, discountPct: 0 } }}
        onAdd={onAdd}
      />,
    );

    const button = screen.getByRole("button", { name: /Añadir Pikachu Plush al carrito/i });
    expect(button).toBeDisabled();
    expect(screen.queryByText(/-%/)).toBeNull();

    const image = screen.getByAltText("Pikachu Plush");
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/src/assets/img/tienda/productos/poke-Ball.png");
  });
});
