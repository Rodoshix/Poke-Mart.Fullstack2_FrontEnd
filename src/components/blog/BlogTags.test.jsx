// src/components/blog/BlogTags.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BlogTags from "./BlogTags";

describe("Testing BlogTags", () => {
  it("CP-BlogTags1: Sin props (undefined) → retorna null (no renderiza)", () => {
    const { container } = render(<BlogTags />);
    expect(container.firstChild).toBeNull();
  });

  it("CP-BlogTags2: Si etiquetas no es un array → retorna null", () => {
    const { container } = render(<BlogTags etiquetas={"no-array"} />);
    expect(container.firstChild).toBeNull();
  });

  it("CP-BlogTags3: Si etiquetas es [] → retorna null", () => {
    const { container } = render(<BlogTags etiquetas={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("CP-BlogTags4: Renderiza <ul> con clase y un <li> por etiqueta, prefijo '#'", () => {
    const tags = ["guía", "pokedex", "consejos"];
    const { container } = render(<BlogTags etiquetas={tags} />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass("blog-entry__tags");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);

    items.forEach((li, idx) => {
      expect(li).toHaveClass("blog-entry__tag");
      expect(li.textContent).toBe(`#${tags[idx]}`);
    });

    expect(container.textContent).toContain("#guía");
    expect(container.textContent).toContain("#pokedex");
    expect(container.textContent).toContain("#consejos");
  });
});
