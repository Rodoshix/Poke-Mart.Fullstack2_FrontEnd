import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminSidebarActions from "./AdminSidebarActions.jsx";

describe("Testing AdminSidebarActions", () => {
  let onStoreRedirect;
  let onLogout;

  beforeEach(() => {
    onStoreRedirect = vi.fn();
    onLogout = vi.fn();
  });

  it("CP-AdminSidebarActions1: Ejecuta callbacks al presionar los botones", () => {
    render(<AdminSidebarActions onStoreRedirect={onStoreRedirect} onLogout={onLogout} />);

    fireEvent.click(screen.getByRole("button", { name: "Ir a la tienda" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    expect(onStoreRedirect).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
