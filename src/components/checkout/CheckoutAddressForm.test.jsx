// src/components/checkout/CheckoutAddressForm.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/data/regiones", () => ({
  REGIONES: [
    { region: "Kanto", comunas: ["Ciudad Celeste", "Ciudad Azafrán"] },
    { region: "Johto", comunas: ["Ciudad Trigal"] },
  ],
}));

import CheckoutAddressForm from "./CheckoutAddressForm";

const baseForm = {
  nombre: "",
  apellido: "",
  email: "",
  calle: "",
  departamento: "",
  region: "",
  comuna: "",
  notas: "",
};

describe("Testing CheckoutAddressForm", () => {
  let setField;

  beforeEach(() => {
    setField = vi.fn();
  });

  it("CP-CAddr1: Render básico: headings, campos principales y pista de regiones", () => {
    render(<CheckoutAddressForm form={baseForm} setField={setField} />);

    expect(screen.getByRole("heading", { name: /información del cliente/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dirección de entrega/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /método de pago/i })).toBeNull();

    expect(screen.getByPlaceholderText(/calle principal 123/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/603/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ej: kanto/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ciudad celeste/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/entre calles, color del edificio, no tiene timbre/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/debe ser una de:\s*kanto,\s*johto/i)).toBeInTheDocument();

  });

  it("CP-CAddr2: Cuando hay región válida se muestran las comunas correspondientes", () => {
    const form = { ...baseForm, region: "Kanto" };
    render(<CheckoutAddressForm form={form} setField={setField} />);

    const comunasHint = screen.getByText(/comunas válidas para kanto:/i);
    expect(comunasHint).toBeInTheDocument();
    expect(comunasHint.textContent).toMatch(/ciudad celeste/i);
    expect(comunasHint.textContent).toMatch(/ciudad azafrán/i);
  });

  it("CP-CAddr3: onChange dispara setField con los pares (campo, valor) esperados", () => {
    const { container } = render(<CheckoutAddressForm form={baseForm} setField={setField} />);

    const email = container.querySelector('input[type="email"]');
    expect(email).toBeInTheDocument();
    fireEvent.change(email, { target: { value: "ash@poke.com" } });
    expect(setField).toHaveBeenCalledWith("email", "ash@poke.com");

    const calle = screen.getByPlaceholderText(/calle principal 123/i);
    fireEvent.change(calle, { target: { value: "Ruta 1 #123" } });
    expect(setField).toHaveBeenCalledWith("calle", "Ruta 1 #123");

    const region = screen.getByPlaceholderText(/ej: kanto/i);
    fireEvent.change(region, { target: { value: "Johto" } });
    expect(setField).toHaveBeenCalledWith("region", "Johto");

    const comuna = screen.getByPlaceholderText(/ej: ciudad celeste/i);
    fireEvent.change(comuna, { target: { value: "Ciudad Trigal" } });
    expect(setField).toHaveBeenCalledWith("comuna", "Ciudad Trigal");

    const notas = screen.getByPlaceholderText(/entre calles/i);
    fireEvent.change(notas, { target: { value: "Dejar en portería" } });
    expect(setField).toHaveBeenCalledWith("notas", "Dejar en portería");
  });

  it("CP-CAddr5: Rellena valores controlados del formulario", () => {
    const form = {
      ...baseForm,
      nombre: "Ash",
      apellido: "Ketchum",
      email: "ash@poke.com",
      calle: "Av. Principal 321",
      departamento: "603",
      region: "Kanto",
      comuna: "Ciudad Celeste",
      notas: "Sin timbre, llamar por teléfono",
    };

    const { container } = render(<CheckoutAddressForm form={form} setField={setField} />);

    const email = container.querySelector('input[type="email"]');
    expect(email).toHaveValue("ash@poke.com");

    expect(screen.getByPlaceholderText(/calle principal 123/i)).toHaveValue("Av. Principal 321");
    expect(screen.getByPlaceholderText(/603/i)).toHaveValue("603");
    expect(screen.getByPlaceholderText(/ej: kanto/i)).toHaveValue("Kanto");
    expect(screen.getByPlaceholderText(/ej: ciudad celeste/i)).toHaveValue("Ciudad Celeste");
    expect(
      screen.getByPlaceholderText(/entre calles, color del edificio, no tiene timbre/i)
    ).toHaveValue("Sin timbre, llamar por teléfono");

  });
});
