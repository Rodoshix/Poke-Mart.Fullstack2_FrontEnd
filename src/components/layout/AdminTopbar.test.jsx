import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminTopbar from "./AdminTopbar.jsx";

describe("Testing AdminTopbar", () => {
  it("CP-AdminTopbar1: Muestra el título y fecha actual", () => {
    const dateSpy = vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("1/1/2025");

    render(<AdminTopbar onToggleSidebar={vi.fn()} />);

    expect(screen.getByText("Panel administrador")).toBeInTheDocument();
    expect(screen.getByText("Hoy es 1/1/2025")).toBeInTheDocument();

    dateSpy.mockRestore();
  });

  it("CP-AdminTopbar2: Ejecuta onToggleSidebar al presionar el botón", () => {
    const onToggleSidebar = vi.fn();
    render(<AdminTopbar onToggleSidebar={onToggleSidebar} />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir o cerrar menú lateral" }));
    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });
});
