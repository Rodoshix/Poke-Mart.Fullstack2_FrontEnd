import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderBadge from "./OrderBadge.jsx";

describe("Testing OrderBadge", () => {
  it("CP-OrderBadge1: Usa el mapeo conocido para estados predefinidos", () => {
    render(<OrderBadge status="completed" />);

    const badge = screen.getByText("Completada");
    expect(badge).toHaveClass("admin-order-badge", "admin-order-badge--success");
  });

  it("CP-OrderBadge2: Normaliza el estado ignorando mayúsculas y espacios", () => {
    render(<OrderBadge status="  Pendiente de Envío  " />);

    expect(screen.getByText("Pendiente de Envío")).toHaveClass("admin-order-badge--warning");
  });

  it("CP-OrderBadge3: Muestra estado desconocido con estilo neutral por defecto", () => {
    render(<OrderBadge status="Personalizado" />);

    expect(screen.getByText("Personalizado")).toHaveClass("admin-order-badge--neutral");
  });
});
