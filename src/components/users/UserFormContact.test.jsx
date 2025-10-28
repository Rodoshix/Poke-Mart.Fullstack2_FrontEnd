import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserFormContact from "./UserFormContact.jsx";

describe("Testing UserFormContact", () => {
  const baseState = {
    email: "usuario@example.com",
    registeredAt: "2024-03-10T12:45:00.000Z",
  };
  let onChange;

  beforeEach(() => {
    vi.clearAllMocks();
    onChange = vi.fn();
  });

  it("CP-UserFormContact1: Muestra correctamente el email y la fecha de registro bloqueada", () => {
    render(<UserFormContact formState={baseState} onChange={onChange} />);

    const emailInput = screen.getByLabelText("Correo electrónico");
    const registeredInput = screen.getByLabelText("Registrado el");

    expect(emailInput).toHaveValue("usuario@example.com");
    expect(registeredInput).toHaveValue("2024-03-10T12:45");
    expect(registeredInput).toBeDisabled();
    expect(registeredInput).toHaveAttribute("readonly");
  });

  it("CP-UserFormContact2: Dispara onChange cuando se modifica el correo", () => {
    render(<UserFormContact formState={baseState} onChange={onChange} />);
    const emailInput = screen.getByLabelText("Correo electrónico");

    fireEvent.change(emailInput, { target: { value: "nuevo@example.com" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("CP-UserFormContact3: Muestra el campo de fecha vacío si no existe registeredAt", () => {
    render(<UserFormContact formState={{ ...baseState, registeredAt: null }} onChange={onChange} />);

    expect(screen.getByLabelText("Registrado el")).toHaveValue("");
  });
});
