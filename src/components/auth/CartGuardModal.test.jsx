// src/components/auth/CartGuardModal.test.jsx
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("bootstrap/js/dist/modal", () => {
  const getOrCreateInstance = vi.fn(() => ({
    show: vi.fn(),
    dispose: vi.fn(),
  }));
  return {
    default: { getOrCreateInstance },
  };
});

import Modal from "bootstrap/js/dist/modal";

import { CartGuardModal, showCartGuardModal } from "./CartGuardModal";

beforeEach(() => {
  Modal.getOrCreateInstance.mockClear();
});

describe("Testing CartGuardModal", () => {
    it("CP-Guard1: Renderiza estructura del modal, título y acciones", () => {
    const { container } = render(<CartGuardModal />);

    const modalRoot = container.querySelector("#guardModal.modal.fade.poke-modal");
    expect(modalRoot).toBeInTheDocument();
    expect(modalRoot).toHaveAttribute("aria-hidden", "true");
    expect(modalRoot).toHaveAttribute("tabindex", "-1");

    const { getByRole, getByText } = within(modalRoot);

    expect(
        getByRole("heading", { level: 2, name: /acceso restringido/i, hidden: true })
    ).toBeInTheDocument();

    expect(
        getByText(/debes iniciar sesión para acceder al carrito/i)
    ).toBeInTheDocument();

    const footerEl = modalRoot.querySelector(".modal-footer");
    expect(footerEl).toBeInTheDocument();
    const closeBtn = within(footerEl).getByRole("button", { name: /cerrar/i, hidden: true });
    expect(closeBtn).toHaveAttribute("data-bs-dismiss", "modal");

    const loginLink = getByRole("link", { name: /iniciar sesión/i, hidden: true });
    expect(loginLink).toHaveAttribute("href", "/login?redirect=carrito");

    const headerClose = modalRoot.querySelector(".btn-close.btn-close-white");
    expect(headerClose).toBeInTheDocument();
    expect(headerClose).toHaveAttribute("data-bs-dismiss", "modal");
    expect(headerClose).toHaveAttribute("aria-label", "Cerrar");
    });


  it("CP-Guard2: En mount crea/obtiene instancia con backdrop='static'", () => {
    const { container } = render(<CartGuardModal />);

    const modalEl = container.querySelector("#guardModal");
    expect(Modal.getOrCreateInstance).toHaveBeenCalledTimes(1);
    expect(Modal.getOrCreateInstance.mock.calls[0][0]).toBe(modalEl);
    expect(Modal.getOrCreateInstance.mock.calls[0][1]).toMatchObject({
      backdrop: "static",
    });
  });

  it("CP-Guard3: showCartGuardModal() llama a .show() de la instancia actual", () => {
    render(<CartGuardModal />);

    const instance = Modal.getOrCreateInstance.mock.results[0].value;
    expect(instance.show).toHaveBeenCalledTimes(0);

    showCartGuardModal();
    expect(instance.show).toHaveBeenCalledTimes(1);
  });

  it("CP-Guard4: Al desmontar se llama .dispose() y luego showCartGuardModal() no invoca .show()", () => {
    const { unmount } = render(<CartGuardModal />);
    const instance = Modal.getOrCreateInstance.mock.results[0].value;

    expect(instance.dispose).toHaveBeenCalledTimes(0);
    unmount();
    expect(instance.dispose).toHaveBeenCalledTimes(1);

    const before = instance.show.mock.calls.length;
    showCartGuardModal();
    const after = instance.show.mock.calls.length;
    expect(after).toBe(before);
  });
});
