// src/components/blog/BlogCard.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

const hoisted = vi.hoisted(() => ({
  resolveSpy: vi.fn((p) => p || "resolved-default.jpg"),
}));
vi.mock("@/utils/resolveImg", () => ({
  resolveImg: (...args) => hoisted.resolveSpy(...args),
}));

import BlogCard from "./BlogCard";

function renderWithRouter(ui) {
  return render(<MemoryRouter initialEntries={["/blog"]}>{ui}</MemoryRouter>);
}

describe("Testing BlogCard", () => {
  beforeEach(() => {
    hoisted.resolveSpy.mockClear();
  });

  it("CP-BlogCard1: Renderiza imagen, meta (fecha+categoría), título, excerpt y link al detalle", () => {
    const blog = {
      id: "pikachu-001",
      titulo: "Cómo entrenar a Pikachu",
      descripcion: "Guía rápida y efectiva.",
      fecha: "2025-10-01",
      categoria: "Tecnología",
      imagen: "/img/pika.png",
    };

    const { container } = renderWithRouter(<BlogCard blog={blog} />);

    expect(hoisted.resolveSpy).toHaveBeenCalledWith("/img/pika.png");

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/img/pika.png");
    expect(img).toHaveAttribute("alt", "Cómo entrenar a Pikachu");
    expect(img).toHaveAttribute("loading", "lazy");

    const meta = container.querySelector(".blog-card__meta");
    expect(meta).toBeInTheDocument();
    expect(meta.textContent).toMatch(/Publicado/i);
    expect(meta.textContent).toContain("Tecnología");

    expect(screen.getByRole("heading", { level: 2, name: /cómo entrenar a pikachu/i })).toBeInTheDocument();
    expect(screen.getByText(/guía rápida y efectiva\./i)).toBeInTheDocument();

    const detail = screen.getByRole("link", { name: /leer más/i });
    expect(detail).toHaveAttribute("href", "/blog/pikachu-001");
    expect(detail).toHaveClass("blog-card__link");
  });

  it("CP-BlogCard2: Defaults cuando faltan campos (titulo, descripcion, fecha, categoria, imagen)", () => {
    const blog = { id: "sin-datos" };
    const { container } = renderWithRouter(<BlogCard blog={blog} />);

    const meta = container.querySelector(".blog-card__meta");
    expect(meta.textContent.trim()).toBe("");

    expect(screen.getByRole("heading", { level: 2, name: "Título" })).toBeInTheDocument();
    expect(screen.getByText("Pronto más detalles…")).toBeInTheDocument();

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("alt", "Publicación de blog");

    const detail = screen.getByRole("link", { name: /leer más/i });
    expect(detail).toHaveAttribute("href", "/blog/sin-datos");
  });

  it("CP-BlogCard3: onError de la imagen cambia a FALLBACK_IMG", () => {
    const blog = { id: "pika", titulo: "Post", imagen: "/bad.png" };
    const { container } = renderWithRouter(<BlogCard blog={blog} />);

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/bad.png");

    fireEvent.error(img);

    expect(img).toHaveAttribute("src", "https://placehold.co/600x400?text=Blog");
  });

  it("CP-BlogCard4: Solo categoría (sin fecha) → meta comienza con '| Categoría'", () => {
    const blog = { id: "solo-cat", categoria: "Noticias" };
    const { container } = renderWithRouter(<BlogCard blog={blog} />);

    const meta = container.querySelector(".blog-card__meta");
    expect(meta.textContent).toMatch(/\|\s*Noticias/);
  });
});
