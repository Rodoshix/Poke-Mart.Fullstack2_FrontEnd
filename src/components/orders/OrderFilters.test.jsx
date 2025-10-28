import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OrderFilters from "./OrderFilters.jsx";

describe("Testing OrderFilters", () => {
  const baseProps = {
    searchTerm: "",
    sortOption: "createdAt:desc",
    onSearchChange: vi.fn(),
    onSortChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-OrderFilters1: Renderiza el buscador y opciones de orden", () => {
    render(<OrderFilters {...baseProps} />);

    expect(screen.getByLabelText("Buscar por ID")).toHaveValue("");
    expect(screen.getByLabelText("Ordenar por")).toHaveValue("createdAt:desc");
    expect(screen.getByText("Más recientes primero")).toBeInTheDocument();
  });

  it("CP-OrderFilters2: Dispara los callbacks al cambiar filtros", () => {
    render(<OrderFilters {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Buscar por ID"), { target: { value: "ORD-10" } });
    fireEvent.change(screen.getByLabelText("Ordenar por"), { target: { value: "total:asc" } });

    expect(baseProps.onSearchChange).toHaveBeenCalledWith("ORD-10");
    expect(baseProps.onSortChange).toHaveBeenCalledWith("total:asc");
  });
});
