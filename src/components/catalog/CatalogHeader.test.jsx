// src/components/catalog/CatalogHeader.test.jsx
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CatalogHeader from "./CatalogHeader";

describe("Testing CatalogHeader", () => {
  it("CP-CH1: Render básico: título, formulario con role='search' y asociación de labels", () => {
    render(
      <CatalogHeader
        q=""
        cat=""
        categorias={[]}
        onChangeQ={() => {}}
        onChangeCat={() => {}}
        onClear={() => {}}
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /productos/i })
    ).toBeInTheDocument();

    const form = screen.getByRole("search", { name: /filtros del catálogo/i });
    expect(form).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/buscar/i);
    expect(searchInput).toHaveAttribute("type", "search");
    expect(searchInput).toHaveAttribute("placeholder", "Nombre o categoría");

    const selectCat = screen.getByRole("combobox", { name: /categoría/i });
    expect(selectCat.tagName.toLowerCase()).toBe("select");
  });

  it("CP-CH2: Cambiar texto en búsqueda dispara onChangeQ con el valor", () => {
    const onChangeQ = vi.fn();
    render(
      <CatalogHeader
        q=""
        cat=""
        categorias={[]}
        onChangeQ={onChangeQ}
        onChangeCat={() => {}}
        onClear={() => {}}
      />
    );

    const input = screen.getByLabelText(/buscar/i);
    fireEvent.change(input, { target: { value: "po" } });
    expect(onChangeQ).toHaveBeenCalledWith("po");
  });

  it("CP-CH3: Cambiar categoría dispara onChangeCat con el valor", () => {
    const onChangeCat = vi.fn();
    render(
      <CatalogHeader
        q=""
        cat=""
        categorias={["Ropa", "Tecnología"]}
        onChangeQ={() => {}}
        onChangeCat={onChangeCat}
        onClear={() => {}}
      />
    );

    const selectCat = screen.getByRole("combobox", { name: /categoría/i });
    const options = within(selectCat).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["Todas", "Ropa", "Tecnología"]);

    fireEvent.change(selectCat, { target: { value: "Tecnología" } });
    expect(onChangeCat).toHaveBeenCalledWith("Tecnología");
  });

  it("CP-CH4: Botón 'Limpiar' llama onClear y tiene aria-label descriptivo", () => {
    const onClear = vi.fn();
    render(
      <CatalogHeader
        q="super"
        cat="Ropa"
        categorias={["Ropa"]}
        onChangeQ={() => {}}
        onChangeCat={() => {}}
        onClear={onClear}
      />
    );

    const clearBtn = screen.getByRole("button", {
      name: /limpiar filtros de búsqueda y categoría/i,
    });
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("CP-CH5: No falla si no se pasan handlers (onChangeQ/onChangeCat/onClear)", () => {
    render(
      <CatalogHeader
        q=""
        cat=""
        categorias={["Ropa"]}
      />
    );

    const input = screen.getByLabelText(/buscar/i);
    const selectCat = screen.getByRole("combobox", { name: /categoría/i });
    const clearBtn = screen.getByRole("button", {
      name: /limpiar filtros de búsqueda y categoría/i,
    });

    expect(() => fireEvent.change(input, { target: { value: "x" } })).not.toThrow();
    expect(() => fireEvent.change(selectCat, { target: { value: "Ropa" } })).not.toThrow();
    expect(() => fireEvent.click(clearBtn)).not.toThrow();
  });

  it("CP-CH6: Renderiza las categorías provistas y preserva el valor controlado", () => {
    render(
      <CatalogHeader
        q="ball"
        cat="Tecnología"
        categorias={["Ropa", "Tecnología", "Transporte"]}
        onChangeQ={() => {}}
        onChangeCat={() => {}}
        onClear={() => {}}
      />
    );

    const input = screen.getByLabelText(/buscar/i);
    expect(input).toHaveValue("ball");

    const selectCat = screen.getByRole("combobox", { name: /categoría/i });
    expect(selectCat).toHaveValue("Tecnología");

    const options = within(selectCat).getAllByRole("option");
    expect(options.map((o) => o.value)).toEqual(["", "Ropa", "Tecnología", "Transporte"]);
  });
});
