import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Footer } from "./Footer.jsx";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing Footer", () => {
  const onSubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-Footer1: Muestra enlaces y limpia el formulario tras suscribirse", () => {
    renderWithRouter(<Footer onSubscribe={onSubscribe} />);

    const emailInput = screen.getByLabelText("Suscríbete al boletín");
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.submit(emailInput.closest("form"));

    expect(onSubscribe).toHaveBeenCalledWith("user@example.com");
    expect(emailInput).toHaveValue("");
    expect(screen.getByRole("link", { name: "Productos" })).toHaveAttribute("href", "/catalogo");
  });

  it("CP-Footer2: No llama onSubscribe si el email está vacío", () => {
    renderWithRouter(<Footer onSubscribe={onSubscribe} />);

    fireEvent.submit(screen.getByLabelText("Suscríbete al boletín").closest("form"));
    expect(onSubscribe).not.toHaveBeenCalled();
  });
});
