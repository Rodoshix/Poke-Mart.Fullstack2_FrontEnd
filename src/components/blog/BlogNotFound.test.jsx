// src/components/blog/BlogMeta.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import BlogMeta from "./BlogMeta";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Testing BlogMeta", () => {
  it("CP-BlogMeta1: Renderiza fecha formateada y categoría", () => {
    vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("01 de octubre de 2025");

    const { container } = render(<BlogMeta fecha="2025-10-01" categoria="Tecnología" />);
    const meta = container.querySelector(".blog-entry__meta");

    expect(meta).toBeInTheDocument();
    expect(meta).toHaveTextContent("01 de octubre de 2025");
    expect(meta).toHaveTextContent("| Tecnología");
  });

  it("CP-BlogMeta2: Solo fecha → no muestra separador ni categoría", () => {
    vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("15 de enero de 2020");

    const { container } = render(<BlogMeta fecha="2020-01-15" />);
    const meta = container.querySelector(".blog-entry__meta");

    expect(meta).toBeInTheDocument();
    expect(meta).toHaveTextContent("15 de enero de 2020");
    expect(meta.textContent).not.toMatch(/\|\s/);
  });

  it("CP-BlogMeta3: Solo categoría → renderiza ‘| Categoría’ sin fecha", () => {
    const { container } = render(<BlogMeta categoria="Noticias" />);
    const meta = container.querySelector(".blog-entry__meta");

    expect(meta).toBeInTheDocument();
    expect(meta.textContent.trim()).toBe("| Noticias");
    expect(meta.textContent).not.toMatch(/\d{4}/);
  });

  it("CP-BlogMeta4: Sin fecha ni categoría → retorna null (no renderiza)", () => {
    const { container } = render(<BlogMeta />);
    expect(container.querySelector(".blog-entry__meta")).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  it("CP-BlogMeta5: Fecha inválida no rompe; omite fecha y muestra solo la categoría", () => {
    vi.spyOn(Date.prototype, "toLocaleDateString").mockImplementation(() => {
      throw new RangeError("Invalid time value");
    });

    const { container } = render(<BlogMeta fecha="no-es-iso" categoria="Guías" />);
    const meta = container.querySelector(".blog-entry__meta");

    expect(meta).toBeInTheDocument();
    expect(meta.textContent).toContain("| Guías");
    expect(meta.textContent).not.toMatch(/\d{4}/);
  });
});
