// src/components/catalog/Pagination.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Pagination from "./Pagination";

describe("Testing Pagination", () => {
  it("CP-Pag1: Render básico con page=1 → 'Anterior' deshabilitado (clase), 'Siguiente' habilitado; muestra número", () => {
    const { container } = render(
      <Pagination page={1} maxPage={5} onPrev={() => {}} onNext={() => {}} />
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    const items = container.querySelectorAll("li.page-item");
    expect(items.length).toBe(3);

    const prevBtn = screen.getByRole("button", { name: /anterior/i });
    const nextBtn = screen.getByRole("button", { name: /siguiente/i });
    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    expect(items[0].classList.contains("disabled")).toBe(true);
    expect(items[2].classList.contains("disabled")).toBe(false);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("CP-Pag2: En última página → 'Siguiente' deshabilitado (clase) y 'Anterior' habilitado; muestra número", () => {
    const { container } = render(
      <Pagination page={5} maxPage={5} onPrev={() => {}} onNext={() => {}} />
    );

    const items = container.querySelectorAll("li.page-item");
    expect(items.length).toBe(3);

    expect(items[0].classList.contains("disabled")).toBe(false);
    expect(items[2].classList.contains("disabled")).toBe(true);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("CP-Pag3: Click en 'Anterior' y 'Siguiente' invoca callbacks cuando no están deshabilitados", () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();

    render(<Pagination page={3} maxPage={5} onPrev={onPrev} onNext={onNext} />);

    fireEvent.click(screen.getByRole("button", { name: /anterior/i }));
    fireEvent.click(screen.getByRole("button", { name: /siguiente/i }));

    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("CP-Pag4: No revienta si no se pasan handlers", () => {
    render(<Pagination page={2} maxPage={4} />);
    fireEvent.click(screen.getByRole("button", { name: /anterior/i }));
    fireEvent.click(screen.getByRole("button", { name: /siguiente/i }));
    expect(true).toBe(true);
  });
});
