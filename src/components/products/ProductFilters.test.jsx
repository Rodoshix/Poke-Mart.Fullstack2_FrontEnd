import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductFilters from "./ProductFilters.jsx";

describe("Testing ProductFilters", () => {
  const categories = ["Cartas", "Peluches"];
  const baseProps = {
    searchTerm: "",
    selectedCategory: "",
    sortOption: "id:asc",
    categories,
    onSearchChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onSortChange: vi.fn(),
    onReset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductFilters1: Muestra los controles y opciones disponibles", () => {
    render(<ProductFilters {...baseProps} />);

    expect(screen.getByLabelText("Buscar")).toHaveValue("");
    expect(screen.getByLabelText("Categoría")).toHaveDisplayValue("Todas");
    expect(screen.getByLabelText("Ordenar por")).toHaveValue("id:asc");

    categories.forEach((category) => {
      expect(screen.getByRole("option", { name: category })).toBeInTheDocument();
    });
    expect(screen.getByText("Limpiar filtros")).toBeInTheDocument();
  });

  it("CP-ProductFilters2: Notifica cambios en los filtros activos", () => {
    render(<ProductFilters {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "pikachu" } });
    fireEvent.change(screen.getByLabelText("Categoría"), { target: { value: "Peluches" } });
    fireEvent.change(screen.getByLabelText("Ordenar por"), { target: { value: "price:desc" } });
    fireEvent.click(screen.getByText("Limpiar filtros"));

    expect(baseProps.onSearchChange).toHaveBeenCalledWith("pikachu");
    expect(baseProps.onCategoryChange).toHaveBeenCalledWith("Peluches");
    expect(baseProps.onSortChange).toHaveBeenCalledWith("price:desc");
    expect(baseProps.onReset).toHaveBeenCalledTimes(1);
  });

  it("CP-ProductFilters3: Oculta el botón de reset cuando no se entrega onReset", () => {
    render(<ProductFilters {...baseProps} onReset={undefined} />);

    expect(screen.queryByText("Limpiar filtros")).toBeNull();
  });
});
