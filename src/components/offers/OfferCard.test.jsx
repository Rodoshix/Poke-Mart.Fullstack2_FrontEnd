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
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.money.mockClear();
    hoisted.countdown.mockClear();
  });

  it("CP-OfferCard1: Renderiza precios, badge y contador cuando corresponde", () => {
    renderWithRouter(<OfferCard product={baseProduct} />);

    expect(hoisted.money).toHaveBeenCalledWith(baseProduct.offer.price);
    expect(hoisted.money).toHaveBeenCalledWith(baseProduct.offer.basePrice);
    expect(screen.getByText("-33%")).toBeInTheDocument();
    expect(hoisted.countdown).toHaveBeenCalledWith(60000);
    expect(screen.getByText("Termina en 60000ms")).toBeInTheDocument();
  });

  it("CP-OfferCard2: Botón principal redirige al detalle de producto", () => {
    renderWithRouter(<OfferCard product={baseProduct} />);

    const cta = screen.getByRole("link", { name: /Ver oferta/i });
    expect(cta).toHaveAttribute("href", "/producto/1");

    expect(screen.getByRole("link", { name: "Ver detalle" })).toHaveAttribute(
      "href",
      "/producto/1",
    );
  });

  it("CP-OfferCard3: Maneja falta de stock y caída de imagen", () => {
    renderWithRouter(
      <OfferCard
        product={{ ...baseProduct, stock: 0, offer: { ...baseProduct.offer, discountPct: 0 } }}
      />,
    );

    const button = screen.getByRole("link", { name: /Ver oferta/i });
    expect(button).toHaveClass("btn-outline-secondary");
    expect(screen.queryByText(/-%/)).toBeNull();

    const image = screen.getByAltText("Pikachu Plush");
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/src/assets/img/tienda/productos/poke-Ball.png");
  });
});
