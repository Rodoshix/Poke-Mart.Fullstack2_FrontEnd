import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Field from "./Field.jsx";

describe("Testing Field", () => {
  const baseProps = {
    label: "Nombre",
    name: "nombre",
    placeholder: "Ingresa tu nombre",
    value: "Ash",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    required: true,
    className: "extra-class",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-Field1: Renderiza un input estándar con sus atributos básicos", () => {
    render(<Field {...baseProps} type="text" />);

    const input = screen.getByLabelText("Nombre");
    expect(input).toHaveValue("Ash");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("placeholder", "Ingresa tu nombre");
    expect(input).toBeRequired();

    fireEvent.change(input, { target: { value: "Misty" } });
    fireEvent.blur(input);

    expect(baseProps.onChange).toHaveBeenCalledTimes(1);
    expect(baseProps.onBlur).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Nombre").className).toContain("registro__label");
  });

  it("CP-Field2: Renderiza un select con opciones provenientes del arreglo", () => {
    const props = {
      ...baseProps,
      as: "select",
      options: [
        "Selecciona una región",
        { value: "kanto", label: "Kanto" },
        { value: "johto", label: "Johto" },
      ],
      value: "johto",
    };

    render(<Field {...props} />);

    const select = screen.getByLabelText("Nombre");
    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveDisplayValue("Johto");

    fireEvent.change(select, { target: { value: "kanto" } });
    expect(props.onChange).toHaveBeenCalledWith(expect.any(Object));

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("Selecciona una región");
    expect(options[1]).toHaveValue("kanto");
    expect(options[2]).toHaveTextContent("Johto");
  });
});
