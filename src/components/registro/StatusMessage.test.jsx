import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import StatusMessage from "./StatusMessage.jsx";

describe("Testing StatusMessage", () => {
  beforeEach(() => {
    // No mocks to limpiar, pero mantenemos la estructura solicitada
  });

  it("CP-StatusMessage1: Muestra el texto y las clases estándar cuando no hay error", () => {
    render(<StatusMessage text="Procesando solicitud" error={false} />);

    const message = screen.getByRole("status");
    expect(message).toHaveTextContent("Procesando solicitud");
    expect(message).toHaveClass("registro__status");
    expect(message).not.toHaveClass("registro__status--error");
  });

  it("CP-StatusMessage2: Incluye la clase de error cuando se solicita", () => {
    render(<StatusMessage text="Ocurrió un problema" error />);

    const message = screen.getByRole("status");
    expect(message).toHaveClass("registro__status", "registro__status--error");
    expect(message).toHaveAttribute("aria-live", "polite");
  });
});
