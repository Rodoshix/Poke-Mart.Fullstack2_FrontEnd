import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserTable from "./UserTable.jsx";

vi.mock("@/hooks/useAuthSession.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

import useAuthSession from "@/hooks/useAuthSession.js";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Testing UserTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-UserTable1: Muestra mensaje vacío cuando no existen usuarios", () => {
    useAuthSession.mockReturnValue({ profile: null });
    renderWithRouter(<UserTable users={[]} />);

    expect(
      screen.getByText("No se encontraron usuarios con los filtros actuales."),
    ).toBeInTheDocument();
  });

  it("CP-UserTable2: Renderiza filas y enlaces de acciones considerando el usuario activo", () => {
    useAuthSession.mockReturnValue({ profile: { id: 7 } });
    const users = [
      {
        id: 7,
        username: "admin",
        nombre: "Ash",
        apellido: "Ketchum",
        email: "admin@example.com",
        role: "admin",
        comuna: "Pallet",
        region: "Kanto",
        registeredAt: "2024-02-01T10:00:00.000Z",
      },
      {
        id: 9,
        username: "misty",
        nombre: "Misty",
        apellido: "Waterflower",
        email: "misty@example.com",
        role: "cliente",
        comuna: "",
        region: "",
        registeredAt: null,
      },
    ];

    renderWithRouter(<UserTable users={users} />);

    const rows = screen.getAllByRole("row");
    // First row is header, then data rows
    expect(rows).toHaveLength(3);

    const adminRow = rows[1];
    const actions = within(adminRow).getAllByRole("link");
    expect(actions[0]).toHaveTextContent("Ver / Editar");
    expect(actions[0]).toHaveAttribute("href", "/admin/perfil");
    expect(actions[1]).toHaveAttribute("href", "/admin/usuarios/7/historial");

    const clientRow = rows[2];
    const clientActions = within(clientRow).getAllByRole("link");
    expect(clientActions[0]).toHaveAttribute("href", "/admin/usuarios/9");
    expect(clientActions[1]).toHaveAttribute("href", "/admin/usuarios/9/historial");
    expect(within(clientRow).getAllByText("—")).toHaveLength(2);
  });
});
