import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import StockBadge, { getStockStatus } from "./StockBadge.jsx";

describe("Testing StockBadge", () => {
  beforeEach(() => {
    // No mocks but mantenemos estructura
  });

  it("CP-StockBadge1: Determina el estado correcto basado en la relación de stock", () => {
    expect(getStockStatus(0, 0)).toEqual({ status: "sin-datos", label: "Sin datos" });
    expect(getStockStatus(1, 100)).toEqual({ status: "critico", label: "Stock crítico" });
    expect(getStockStatus(20, 100)).toEqual({ status: "bajo", label: "Stock bajo" });
    expect(getStockStatus(130, 100)).toEqual({ status: "sobrante", label: "Stock alto" });
    expect(getStockStatus(80, 100)).toEqual({ status: "saludable", label: "Stock saludable" });
  });

  it("CP-StockBadge2: Renderiza el badge con la clase correspondiente", () => {
    render(<StockBadge stock={5} stockBase={20} />);

    const badge = screen.getByText("Stock bajo");
    expect(badge).toHaveClass("admin-stock-badge", "admin-stock-badge--bajo");
  });
});
