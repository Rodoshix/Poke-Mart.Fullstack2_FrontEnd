// src/components/catalog/ProductCard.test.jsx
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductCard } from "./ProductCard";

vi.mock("@/utils/resolveImg", () => ({
  resolveImg: vi.fn((p) => `RESOLVED:${p}`),
}));
vi.mock("@/utils/money", () => ({
  money: vi.fn((v) => `CLP ${v}`),
}));

import { resolveImg } from "@/utils/resolveImg";
import { money } from "@/utils/money";

const PLACEHOLDER = "/src/assets/img/tienda/productos/poke-Ball.png";

const baseProduct = {
  id: "A-01/��",
  nombre: "Super Ball",
  categoria: "Poké Balls",
  precio: 1500,
  imagen: "/img/ball.png",
};

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Testing ProductCard", () => {
  it("CP-PC1: Render básico: título, links correctos, imagen, categoría y precio", () => {
    renderWithRouter(<ProductCard product={baseProduct} />);

    const encodedId = encodeURIComponent(baseProduct.id);
    const expectedHref = `/producto/${encodedId}`;

    const mediaLink = screen.getByRole("link", { name: /ver super ball/i });
    expect(mediaLink).toBeInTheDocument();
    expect(mediaLink).toHaveAttribute("href", expectedHref);

    const heading = screen.getByRole("heading", { level: 3 });
    const titleLink = within(heading).getByRole("link", { name: baseProduct.nombre });
    expect(titleLink).toHaveAttribute("href", expectedHref);

    const img = screen.getByRole("img", { name: baseProduct.nombre });
    expect(resolveImg).toHaveBeenCalledWith(baseProduct.imagen);
    expect(img.getAttribute("src")).toContain(`RESOLVED:${baseProduct.imagen}`);

    expect(screen.getByText(baseProduct.categoria)).toBeInTheDocument();
    expect(money).toHaveBeenCalledWith(baseProduct.precio);
    expect(screen.getByText(`CLP ${baseProduct.precio}`)).toBeInTheDocument();
  });

  it("CP-PC2: onError de la imagen cae al PLACEHOLDER", () => {
    renderWithRouter(<ProductCard product={baseProduct} />);
    const img = screen.getByRole("img", { name: baseProduct.nombre });

    fireEvent.error(img);

    expect(img.getAttribute("src")).toContain(PLACEHOLDER);
  });

  it("CP-PC3: Si no hay categoría muestra 'Sin categoria' como fallback", () => {
    const product = { ...baseProduct, categoria: undefined };
    renderWithRouter(<ProductCard product={product} />);
    expect(screen.getByText("Sin categoria")).toBeInTheDocument();
  });

  it("CP-PC4: Enlaces usan correctamente encodeURIComponent en el id del producto", () => {
    const weird = { ...baseProduct, id: "ID/with spaces/��" };
    renderWithRouter(<ProductCard product={weird} />);
    const encoded = encodeURIComponent(weird.id);
    const expectedHref = `/producto/${encoded}`;

    const mediaLink = screen.getByRole("link", { name: new RegExp(`ver ${weird.nombre}`, "i") });
    const titleLink = screen.getByRole("link", { name: weird.nombre });

    expect(mediaLink).toHaveAttribute("href", expectedHref);
    expect(titleLink).toHaveAttribute("href", expectedHref);
  });

  it("CP-PC5: Muestra precio tachado y badge cuando hay oferta", () => {
    const productOnSale = {
      ...baseProduct,
      precio: 2000,
      discountPct: 25,
      endsAt: new Date(Date.now() + 3600_000).toISOString(),
    };
    renderWithRouter(<ProductCard product={productOnSale} />);

    expect(screen.getByText(/-25%/)).toBeInTheDocument();
    expect(screen.getByText("CLP 2000")).toBeInTheDocument(); // base tachado
    expect(screen.getByText("CLP 1500")).toBeInTheDocument(); // precio con descuento
  });
});
