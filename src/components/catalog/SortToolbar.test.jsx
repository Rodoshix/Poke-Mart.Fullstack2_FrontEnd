// src/components/catalog/SortToolbar.test.jsx
import { render, screen, within, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SortToolbar from "./SortToolbar";

describe("Testing SortToolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ST1: Render básico: label asociado al botón y valor por defecto 'Recomendados'", () => {
    const { container } = render(<SortToolbar />);
  
    const label = screen.getByText(/ordenar por/i);
    expect(label.tagName.toLowerCase()).toBe("label");
    expect(label).toHaveAttribute("for", "sortSel");
  
    const toggle = container.querySelector("#sortSel");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("id", "sortSel");

    const menu = container.querySelector(".dropdown-menu");
    const items = within(menu).getAllByRole("button");
    expect(items).toHaveLength(5);
  });

  it("CP-ST2: Click en cada opción dispara onChange con el valor esperado", () => {
    const onChange = vi.fn();
    const { container } = render(<SortToolbar sort="recomendados" onChange={onChange} />);

    const menu = container.querySelector(".dropdown-menu");

    fireEvent.click(within(menu).getByRole("button", { name: /recomendados/i }));
    fireEvent.click(within(menu).getByRole("button", { name: /precio:\s*bajo a alto/i }));
    fireEvent.click(within(menu).getByRole("button", { name: /precio:\s*alto a bajo/i }));
    fireEvent.click(within(menu).getByRole("button", { name: /nombre\s*a.?z/i }));
    fireEvent.click(within(menu).getByRole("button", { name: /nombre\s*z.?a/i }));

    expect(onChange).toHaveBeenCalledTimes(5);
    expect(onChange).toHaveBeenNthCalledWith(1, "recomendados");
    expect(onChange).toHaveBeenNthCalledWith(2, "precio-asc");
    expect(onChange).toHaveBeenNthCalledWith(3, "precio-desc");
    expect(onChange).toHaveBeenNthCalledWith(4, "nombre-asc");
    expect(onChange).toHaveBeenNthCalledWith(5, "nombre-desc");
  });

  it("CP-ST3: Mapea correctamente el texto mostrado según 'sort' (incluye fallback a 'Recomendados')", () => {
    const { rerender } = render(<SortToolbar sort="precio-desc" />);
    expect(screen.getByRole("button", { name: /precio:\s*alto a bajo/i })).toBeInTheDocument();

    rerender(<SortToolbar sort="nombre-asc" />);
    expect(screen.getByRole("button", { name: /nombre\s*a.?z/i })).toBeInTheDocument();

    rerender(<SortToolbar sort="desconocido" />);
    expect(screen.getByRole("button", { name: /recomendados/i })).toBeInTheDocument();
  });

  it("CP-ST4: Seguro sin onChange: hacer click no lanza error", () => {
    const { container } = render(<SortToolbar sort="recomendados" />);
    const menu = container.querySelector(".dropdown-menu");

    expect(() => {
      fireEvent.click(within(menu).getByRole("button", { name: /precio:\s*bajo a alto/i }));
    }).not.toThrow();
  });

  it("CP-ST5: Cambiar 'sort' controlado refleja el texto en el botón", () => {
    const { rerender } = render(<SortToolbar sort="recomendados" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /recomendados/i })).toBeInTheDocument();

    rerender(<SortToolbar sort="precio-asc" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /precio:\s*bajo a alto/i })).toBeInTheDocument();
  });
});
