import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import Paginator from "./Paginator.jsx";

describe("Testing Paginator", () => {
  it("CP-Paginator1: Devuelve null cuando solo hay una página", () => {
    const { container } = render(
      <Paginator currentPage={1} totalPages={1} onPageChange={vi.fn()} pageSize={10} totalItems={5} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("CP-Paginator2: Renderiza botones, rangos y elipses en paginación intermedia", () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={7}
        onPageChange={vi.fn()}
        pageSize={10}
        totalItems={65}
      />,
    );

    expect(screen.getByText("Mostrando 21 - 30 de 65 productos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Anterior" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Siguiente" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByText("…")).toHaveLength(1);
  });

  it("CP-Paginator3: Cambia de página correctamente y evita avanzar fuera de rango", () => {
    const TestWrapper = ({ totalPages }) => {
      const [page, setPage] = useState(2);
      return (
        <Paginator
          currentPage={page}
          totalPages={totalPages}
          pageSize={10}
          totalItems={40}
          onPageChange={setPage}
        />
      );
    };

    render(<TestWrapper totalPages={4} />);

    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page");

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page");

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByRole("button", { name: "4" })).toHaveAttribute("aria-current", "page");

    // no cambio adicional al intentar avanzar fuera del rango
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByRole("button", { name: "4" })).toHaveAttribute("aria-current", "page");
  });
});
