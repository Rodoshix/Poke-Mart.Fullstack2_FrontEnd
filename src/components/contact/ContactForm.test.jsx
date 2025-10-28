import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hookMock = vi.hoisted(() => ({
  data: {
    fields: { name: "", email: "", message: "" },
    set: {
      setName: vi.fn(),
      setEmail: vi.fn(),
      setMessage: vi.fn(),
    },
    errors: { nameError: "", emailError: "", messageError: "" },
    status: { text: "", error: false },
    sending: false,
    onSubmit: vi.fn((event) => event.preventDefault()),
  },
}));

vi.mock("@/hooks/useContactoForm", () => ({
  __esModule: true,
  useContactoForm: () => hookMock.data,
}));

import ContactForm from "./ContactForm.jsx";

describe("Testing ContactForm", () => {
  beforeEach(() => {
    Object.assign(hookMock.data, {
      fields: { name: "Ash", email: "ash@example.com", message: "Hola" },
      set: {
        setName: vi.fn(),
        setEmail: vi.fn(),
        setMessage: vi.fn(),
      },
      errors: { nameError: "", emailError: "", messageError: "" },
      status: { text: "", error: false },
      sending: false,
      onSubmit: vi.fn((event) => event.preventDefault()),
    });
  });

  it("CP-ContactForm1: Enlaza los campos del formulario y ejecuta onSubmit", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Misty" } });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "misty@example.com" } });
    fireEvent.change(screen.getByLabelText("Mensaje"), { target: { value: "Hola!" } });

    expect(hookMock.data.set.setName).toHaveBeenCalledWith("Misty");
    expect(hookMock.data.set.setEmail).toHaveBeenCalledWith("misty@example.com");
    expect(hookMock.data.set.setMessage).toHaveBeenCalledWith("Hola!");

    const form = screen.getByRole("button", { name: "Enviar mensaje" }).closest("form");
    fireEvent.submit(form);
    expect(hookMock.data.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("CP-ContactForm2: Muestra errores, estado y bloquea el botón al enviar", () => {
    Object.assign(hookMock.data, {
      errors: {
        nameError: "Ingresa tu nombre",
        emailError: "Correo inválido",
        messageError: "Mensaje requerido",
      },
      status: { text: "Ocurrió un error", error: true },
      sending: true,
    });

    render(<ContactForm />);

    expect(screen.getByLabelText("Nombre")).toHaveClass("is-invalid");
    expect(screen.getByLabelText("Correo electrónico")).toHaveClass("is-invalid");
    expect(screen.getByLabelText("Mensaje")).toHaveClass("is-invalid");
    expect(screen.getByRole("button", { name: "Enviando..." })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Ocurrió un error");
    expect(screen.getByRole("status")).toHaveClass("contacto-form__status--error");
  });
});
