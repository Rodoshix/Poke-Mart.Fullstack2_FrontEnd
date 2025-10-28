import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserFormIdentity from "./UserFormIdentity.jsx";

describe("Testing UserFormIdentity", () => {
  const formState = {
    nombre: "Misty",
    apellido: "Waterflower",
    run: "12.345.678-9",
    fechaNacimiento: "1995-05-01",
  };
  let onChange;
  let onRunBlur;

  beforeEach(() => {
    vi.clearAllMocks();
    onChange = vi.fn();
    onRunBlur = vi.fn();
  });

  it("CP-UserFormIdentity1: Renderiza los campos de identidad con los valores actuales", () => {
    render(<UserFormIdentity formState={formState} onChange={onChange} onRunBlur={onRunBlur} />);

    expect(screen.getByLabelText("Nombre")).toHaveValue("Misty");
    expect(screen.getByLabelText("Apellido")).toHaveValue("Waterflower");
    expect(screen.getByLabelText("RUN")).toHaveValue("12.345.678-9");
    expect(screen.getByLabelText("Fecha de nacimiento")).toHaveValue("1995-05-01");
  });

  it("CP-UserFormIdentity2: Notifica cambios y ejecuta la normalización del RUN en blur", () => {
    render(<UserFormIdentity formState={formState} onChange={onChange} onRunBlur={onRunBlur} />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Brock" } });
    fireEvent.blur(screen.getByLabelText("RUN"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onRunBlur).toHaveBeenCalledTimes(1);
  });
});
