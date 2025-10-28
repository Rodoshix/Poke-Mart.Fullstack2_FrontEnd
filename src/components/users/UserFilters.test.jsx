import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserFilters from "./UserFilters.jsx";

describe("Testing UserFilters", () => {
  const roles = ["admin", "cliente"];
  const regions = ["Metropolitana", "Valparaíso"];
  const sortOptions = [
    { value: "name", label: "Nombre" },
    { value: "email", label: "Correo" },
  ];

  let props;

  beforeEach(() => {
    vi.clearAllMocks();
    props = {
      roles,
      regions,
      sortOptions,
      selectedRole: "",
      selectedRegion: "",
      sortOption: "name",
      searchTerm: "",
      onRoleChange: vi.fn(),
      onRegionChange: vi.fn(),
      onSortChange: vi.fn(),
      onSearchChange: vi.fn(),
    };
  });

  it("CP-UserFilters1: Muestra todos los filtros con sus opciones disponibles", () => {
    render(<UserFilters {...props} />);

    expect(screen.getByLabelText("Buscar")).toBeInTheDocument();
    expect(screen.getByLabelText("Rol")).toHaveDisplayValue("Todos");
    expect(screen.getByLabelText("Región")).toHaveDisplayValue("Todas");
    expect(screen.getByLabelText("Ordenar")).toHaveValue("name");

    roles.forEach((role) => {
      expect(screen.getByRole("option", { name: role })).toBeInTheDocument();
    });
    regions.forEach((region) => {
      expect(screen.getAllByRole("option", { name: region })).not.toHaveLength(0);
    });
    sortOptions.forEach((option) => {
      expect(screen.getByRole("option", { name: option.label })).toHaveValue(option.value);
    });
  });

  it("CP-UserFilters2: Dispara los callbacks correspondientes al cambiar los filtros", () => {
    render(<UserFilters {...props} />);

    fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "pikachu" } });
    fireEvent.change(screen.getByLabelText("Rol"), { target: { value: "cliente" } });
    fireEvent.change(screen.getByLabelText("Región"), { target: { value: "Valparaíso" } });
    fireEvent.change(screen.getByLabelText("Ordenar"), { target: { value: "email" } });

    expect(props.onSearchChange).toHaveBeenCalledWith("pikachu");
    expect(props.onRoleChange).toHaveBeenCalledWith("cliente");
    expect(props.onRegionChange).toHaveBeenCalledWith("Valparaíso");
    expect(props.onSortChange).toHaveBeenCalledWith("email");
  });

  it("CP-UserFilters3: Renderiza el botón para limpiar filtros solo si se entrega onReset", () => {
    const { rerender } = render(<UserFilters {...props} />);
    expect(screen.queryByRole("button", { name: /Limpiar filtros/i })).toBeNull();

    const onReset = vi.fn();
    rerender(<UserFilters {...props} onReset={onReset} />);

    const resetButton = screen.getByRole("button", { name: /Limpiar filtros/i });
    fireEvent.click(resetButton);
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
