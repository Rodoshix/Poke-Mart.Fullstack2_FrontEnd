// src/components/blog/Blog.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  mockBlogs: [],
}));

vi.mock("@/data/blogs.json", () => ({
  get default() {
    return hoisted.mockBlogs;
  },
}));

vi.mock("./BlogCard.jsx", () => {
  const renderSpy = vi.fn();
  const MockCard = (props) => {
    renderSpy(props);
    return <div data-testid="blog-card">{props.blog?.title}</div>;
  };
  return {
    default: MockCard,
    __renderSpy: renderSpy,
  };
});

import { __renderSpy as blogCardSpy } from "./BlogCard.jsx";
import Blog from "./Blog.jsx";

describe("Testing Blog", () => {
  beforeEach(() => {
    blogCardSpy.mockClear();
    hoisted.mockBlogs = [];
  });

  it("CP-Blog1: Estado vacío → muestra alerta informativa", () => {
    hoisted.mockBlogs = [];
    render(<Blog />);

    const alert = screen.getByRole("status");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/aún no hay publicaciones disponibles\./i);
    expect(screen.queryAllByTestId("blog-card")).toHaveLength(0);
  });

  it("CP-Blog2: Si blogsData no es un array → trata como vacío y muestra alerta", () => {
    hoisted.mockBlogs = { not: "array" };
    render(<Blog />);

    const alert = screen.getByRole("status");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/aún no hay publicaciones disponibles/i);
  });

  it("CP-Blog3: Renderiza una tarjeta por cada blog y mantiene aria-live='polite'", () => {
    hoisted.mockBlogs = [
      { id: 1, title: "Primer post" },
      { id: 2, title: "Segundo post" },
      { id: 3, title: "Tercer post" },
    ];

    const { container } = render(<Blog />);

    const grid = container.querySelector("section.blog-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("aria-live", "polite");

    const cards = screen.getAllByTestId("blog-card");
    expect(cards).toHaveLength(3);
    expect(cards.map((c) => c.textContent)).toEqual([
      "Primer post",
      "Segundo post",
      "Tercer post",
    ]);

    expect(blogCardSpy).toHaveBeenCalledTimes(3);
    expect(blogCardSpy.mock.calls[0][0].blog).toEqual({ id: 1, title: "Primer post" });
    expect(blogCardSpy.mock.calls[1][0].blog).toEqual({ id: 2, title: "Segundo post" });
    expect(blogCardSpy.mock.calls[2][0].blog).toEqual({ id: 3, title: "Tercer post" });
  });
});
