import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReportFilters from "./ReportFilters.jsx";

describe("Testing ReportFilters", () => {
  const categories = ["Pokeballs", "Accesorios"];
  const baseProps = {
    categories,
    selectedCategory: "",
    selectedStatus: "all",
    searchTerm: "",
    onCategoryChange: vi.fn(),
    onStatusChange: vi.fn(),
    onSearchChange: vi.fn(),
    onReset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ReportFilters1: Renderiza selectores y opciones disponibles", () => {
    render(<ReportFilters {...baseProps} />);

    expect(screen.getByLabelText("Categoría")).toHaveDisplayValue("Todas");
    expect(screen.getByLabelText("Estado de stock")).toHaveDisplayValue("Todos los estados");
    expect(screen.getByLabelText("Buscar")).toHaveValue("");
    expect(screen.getByText("Limpiar filtros")).toBeInTheDocument();

    categories.forEach((category) => {
      expect(screen.getByRole("option", { name: category })).toBeInTheDocument();
    });
  });

  it("CP-ReportFilters2: Dispara callbacks cuando se modifican filtros", () => {
    render(<ReportFilters {...baseProps} />);

    fireEvent.change(screen.getByLabelText("Categoría"), { target: { value: "Accesorios" } });
    fireEvent.change(screen.getByLabelText("Estado de stock"), { target: { value: "critical" } });
    fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "pika" } });
    fireEvent.click(screen.getByText("Limpiar filtros"));

    expect(baseProps.onCategoryChange).toHaveBeenCalledWith("Accesorios");
    expect(baseProps.onStatusChange).toHaveBeenCalledWith("critical");
    expect(baseProps.onSearchChange).toHaveBeenCalledWith("pika");
    expect(baseProps.onReset).toHaveBeenCalledTimes(1);
  });

  it("CP-ReportFilters3: Oculta el botón de reset cuando no se proporciona onReset", () => {
    render(<ReportFilters {...baseProps} onReset={undefined} />);

    expect(screen.queryByText("Limpiar filtros")).toBeNull();
  });
});
