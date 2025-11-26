import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/resolveImg.js", () => ({
  __esModule: true,
  resolveImg: vi.fn(() => "resolved/url.png"),
}));

import { resolveImg } from "@/utils/resolveImg.js";
import ProductTable from "./ProductTable.jsx";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing ProductTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductTable1: Muestra mensaje cuando no existen productos", () => {
    renderWithRouter(<ProductTable products={[]} />);

    expect(
      screen.getByText("No hay productos para mostrar con los filtros seleccionados."),
    ).toBeInTheDocument();
  });

  it("CP-ProductTable2: Renderiza filas con imagen de datos embebidos y enlace de edición", () => {
    const products = [
      {
        id: 7,
        nombre: "Pikachu Plush",
        stock: 5,
        precio: 19990,
        imagen: "data:image/png;base64,AAA",
        active: true,
      },
    ];

    const onToggleActive = vi.fn();
    const onDelete = vi.fn();
    renderWithRouter(<ProductTable products={products} onToggleActive={onToggleActive} onDelete={onDelete} />);

    expect(screen.getByAltText("Pikachu Plush")).toHaveAttribute("src", "data:image/png;base64,AAA");
    expect(screen.getByText("Pikachu Plush")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Editar" })).toHaveAttribute(
      "href",
      "/admin/productos/7/editar",
    );
    expect(screen.getByText("$19.990")).toBeInTheDocument();
    expect(screen.getByText("Activo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Desactivar" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Eliminar" })).toBeEnabled();
  });

  it("CP-ProductTable3: Usa resolveImg cuando no se encuentra la ruta local y muestra placeholder si no hay imagen", () => {
    const products = [
      {
        id: 9,
        nombre: "Great Ball",
        stock: 0,
        precio: 8990,
        imagen: "imagenes/great-ball.png",
        active: false,
      },
      {
        id: 10,
        nombre: "Sin Imagen",
        stock: 12,
        precio: 5990,
        imagen: "",
        active: true,
      },
    ];

    renderWithRouter(<ProductTable products={products} />);

    expect(resolveImg).toHaveBeenCalledWith("imagenes/great-ball.png");
    expect(screen.getByAltText("Great Ball")).toHaveAttribute("src", "resolved/url.png");
    expect(screen.getByText("S")).toHaveClass("admin-product-table__placeholder");
  });

  it("CP-ProductTable4: Deshabilita edición en modo solo lectura", () => {
    const products = [
      { id: 11, nombre: "Poke Ball", stock: 8, precio: 1290, imagen: "", active: true },
    ];

    renderWithRouter(<ProductTable products={products} readOnly />);

    const editLink = screen.getByRole("link", { name: "Editar" });
    expect(editLink).toHaveClass("disabled");
    expect(editLink).toHaveAttribute("aria-disabled", "true");
    expect(editLink).toHaveAttribute("tabindex", "-1");
  });
});
