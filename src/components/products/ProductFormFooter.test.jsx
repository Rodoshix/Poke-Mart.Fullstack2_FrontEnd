import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductFormFooter from "./ProductFormFooter.jsx";

describe("Testing ProductFormFooter", () => {
  const baseProps = {
    errors: [],
    onCancel: vi.fn(),
    isSubmitting: false,
    submitLabel: "Guardar",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductFormFooter1: Muestra botón de cancelar cuando se entrega onCancel", () => {
    render(<ProductFormFooter {...baseProps} />);

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar" })).toBeEnabled();
  });

  it("CP-ProductFormFooter2: Despliega errores y bloquea submit cuando está enviando", () => {
    const props = {
      ...baseProps,
      errors: ["Error 1", "Error 2"],
      isSubmitting: true,
    };
    render(<ProductFormFooter {...props} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Error 1")).toBeInTheDocument();
    expect(screen.getByText("Guardando...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();
  });

  it("CP-ProductFormFooter3: No renderiza botón de cancelación cuando no se pasa onCancel", () => {
    render(<ProductFormFooter {...baseProps} onCancel={undefined} />);

    expect(screen.queryByRole("button", { name: "Cancelar" })).toBeNull();
  });

  it("CP-ProductFormFooter4: Llama a onCancel cuando se hace clic", () => {
    render(<ProductFormFooter {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(baseProps.onCancel).toHaveBeenCalledTimes(1);
  });
});
