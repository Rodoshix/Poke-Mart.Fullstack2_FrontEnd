import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CategorySidebar from "./CategorySidebar";

const CATS_7 = [
  "Ropa",
  "Tecnología",
  "Transporte",
  "Expedición",
  "Curación",
  "Poké Balls",
  "Rastreadores",
];

describe("Testing CategorySidebar", () => {
  it("CP-CSide1: Estado vacío → muestra 'No hay categorías' y no muestra botón limpiar", () => {
    render(<CategorySidebar categorias={[]} value="" />);
    expect(screen.getByText(/^Categoría$/i)).toBeInTheDocument();
    expect(screen.getByText(/no hay categorías/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /limpiar categoría/i })
    ).not.toBeInTheDocument();
  });

  it("CP-CSide2: Segmenta 6 visibles y el resto en <details>; summary '+ Ver Más'; seleccionar oculta dispara onChange", () => {
    const onChange = vi.fn();
    const { container } = render(
      <CategorySidebar categorias={CATS_7} value="Tecnología" onChange={onChange} />
    );

    const directLabels = container.querySelectorAll(".list-group > label");
    expect(directLabels.length).toBe(6);
    expect([...directLabels].map((l) => l.textContent?.trim())).toEqual(
      CATS_7.slice(0, 6)
    );

    const details = container.querySelector("details");
    expect(details).toBeInTheDocument();
    const summary = details?.querySelector("summary");
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveTextContent(/\+ ver más/i);

    const hiddenRadio = screen.getByLabelText("Rastreadores");
    fireEvent.click(hiddenRadio);
    expect(onChange).toHaveBeenCalledWith("Rastreadores");
  });

  it("CP-CSide3: Seleccionar una visible (Ropa) llama onChange con el valor", () => {
    const onChange = vi.fn();
    render(<CategorySidebar categorias={CATS_7} value="" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Ropa"));
    expect(onChange).toHaveBeenCalledWith("Ropa");
  });

  it("CP-CSide4: Botón 'Limpiar categoría' envía onChange('')", () => {
    const onChange = vi.fn();
    render(<CategorySidebar categorias={CATS_7} value="Ropa" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /limpiar categoría/i }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("CP-CSide5: No falla si no se pasa onChange (seguro al hacer click)", () => {
    render(<CategorySidebar categorias={CATS_7} value="Tecnología" />);
    fireEvent.click(screen.getByLabelText("Transporte"));
    fireEvent.click(screen.getByLabelText("Rastreadores"));
    fireEvent.click(screen.getByRole("button", { name: /limpiar categoría/i }));
    expect(true).toBe(true);
  });

  it("CP-CSide6: Controlado: respeta 'value' y marca el radio correspondiente (visible u oculto)", () => {
    const { rerender } = render(
      <CategorySidebar categorias={CATS_7} value="Transporte" />
    );
    expect(screen.getByLabelText("Transporte")).toBeChecked();

    rerender(<CategorySidebar categorias={CATS_7} value="Rastreadores" />);
    expect(screen.getByLabelText("Rastreadores")).toBeChecked();
  });
});
