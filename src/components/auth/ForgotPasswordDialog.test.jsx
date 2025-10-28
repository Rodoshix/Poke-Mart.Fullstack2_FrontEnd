// src/components/auth/ForgotPasswordDialog.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

describe("Testing ForgotPasswordDialog", () => {
  let onClose, setForgotEmail, onSubmitEmail, onConfirmCode;

  beforeEach(() => {
    onClose = vi.fn();
    setForgotEmail = vi.fn();
    onSubmitEmail = vi.fn((e) => e?.preventDefault?.());
    onConfirmCode = vi.fn();
  });

  it("CP-Forgot1: Alterna apertura/cierre del dialog usando open (showModal/close)", () => {
    const { container, rerender } = render(
      <ForgotPasswordDialog
        open={false}
        onClose={onClose}
        step="email"
        forgotEmail=""
        setForgotEmail={setForgotEmail}
        forgotErr=""
        demoCode="123456"
        onSubmitEmail={onSubmitEmail}
        onConfirmCode={onConfirmCode}
      />
    );

    const dlg = container.querySelector("dialog");
    expect(dlg).toBeInTheDocument();

    dlg.showModal = vi.fn(function () { this.open = true; });
    dlg.close = vi.fn(function () { this.open = false; });

    // Abrir
    rerender(
      <ForgotPasswordDialog
        open
        onClose={onClose}
        step="email"
        forgotEmail=""
        setForgotEmail={setForgotEmail}
        forgotErr=""
        demoCode="123456"
        onSubmitEmail={onSubmitEmail}
        onConfirmCode={onConfirmCode}
      />
    );
    expect(dlg.showModal).toHaveBeenCalledTimes(1);
    expect(dlg.open).toBe(true);

    // Cerrar
    rerender(
      <ForgotPasswordDialog
        open={false}
        onClose={onClose}
        step="email"
        forgotEmail=""
        setForgotEmail={setForgotEmail}
        forgotErr=""
        demoCode="123456"
        onSubmitEmail={onSubmitEmail}
        onConfirmCode={onConfirmCode}
      />
    );
    expect(dlg.close).toHaveBeenCalledTimes(1);
    expect(dlg.open).toBe(false);
  });

  it("CP-Forgot2: Step 'code' → muestra mensaje de error si forgotErr está presente", () => {
    render(
      <ForgotPasswordDialog
        open
        onClose={onClose}
        step="code"
        forgotEmail=""
        setForgotEmail={setForgotEmail}
        forgotErr="Código inválido"
        demoCode="111111"
        onSubmitEmail={onSubmitEmail}
        onConfirmCode={onConfirmCode}
      />
    );

    expect(screen.getByText(/código inválido/i)).toBeInTheDocument();
  });
});
