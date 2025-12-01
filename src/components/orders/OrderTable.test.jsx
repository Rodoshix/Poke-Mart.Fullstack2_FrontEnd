import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OrderTable from "./OrderTable.jsx";

vi.mock("@/components/orders/OrderBadge.jsx", () => ({
  __esModule: true,
  default: vi.fn(({ status }) => <span data-testid="order-badge">{status}</span>),
}));

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing OrderTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-OrderTable1: Muestra mensaje cuando no hay órdenes", () => {
    renderWithRouter(<OrderTable orders={[]} />);

    expect(
      screen.getByText("No se encontraron órdenes con los filtros actuales."),
    ).toBeInTheDocument();
  });

  it("CP-OrderTable2: Renderiza filas con formatos de fecha y moneda", () => {
    const orders = [
      {
        id: "ORD-01",
        backendId: 101,
        createdAt: "2024-01-20T10:30:00Z",
        customer: "Ash Ketchum",
        total: 19990,
        status: "processing",
      },
      {
        id: "ORD-02",
        backendId: 102,
        createdAt: null,
        customer: "Misty",
        total: null,
        status: "completed",
      },
    ];

    renderWithRouter(<OrderTable orders={orders} />);

    expect(screen.getByText("ORD-01")).toBeInTheDocument();
    expect(screen.getByText("Ash Ketchum")).toBeInTheDocument();
    expect(screen.getAllByTestId("order-badge")).toHaveLength(2);
    const links = screen.getAllByRole("link", { name: "Ver detalle" });
    expect(links[0]).toHaveAttribute("href", "/admin/ordenes/101");
    expect(links[1]).toHaveAttribute("href", "/admin/ordenes/102");
    expect(screen.getByText(/Sin fecha/)).toBeInTheDocument();
  });

  it("CP-OrderTable3: Mantiene valores originales cuando la fecha es inválida", () => {
    const orders = [
      { id: "ORD-03", createdAt: "fecha-invalida", customer: "Brock", total: 5000, status: "pending" },
    ];

    renderWithRouter(<OrderTable orders={orders} />);

    expect(screen.getByText("fecha-invalida")).toBeInTheDocument();
  });
});
