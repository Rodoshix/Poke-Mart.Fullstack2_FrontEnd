import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatCard from "./StatCard.jsx";

describe("Testing StatCard", () => {
  it("CP-StatCard1: Muestra títulos, valores y tendencia cuando se proveen", () => {
    render(
      <StatCard
        title="Ventas"
        icon="💰"
        primaryValue="$120K"
        primaryLabel="Ingresos"
        secondaryLabel="Pedidos"
        secondaryValue="200"
        trend={{ label: "vs mes anterior", value: "+12%", variant: "positive" }}
        tone="success"
      />,
    );

    expect(screen.getByText("Ventas")).toBeInTheDocument();
    expect(screen.getByText("💰")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("$120K")).toBeInTheDocument();
    expect(screen.getByText("Pedidos")).toBeInTheDocument();
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("CP-StatCard2: Oculta secciones opcionales cuando faltan datos", () => {
    render(<StatCard title="Usuarios" primaryValue="80" />);

    expect(screen.queryByText("Usuarios")).toBeInTheDocument();
    expect(screen.queryByText("admin-stat-card__secondary")).toBeNull();
    expect(screen.queryByText("+12%")).toBeNull();
  });
});
