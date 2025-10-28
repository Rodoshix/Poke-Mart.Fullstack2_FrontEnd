// src/components/blog/BlogMedia.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  resolveSpy: vi.fn((p) => p || "resolved-default.jpg"),
}));

vi.mock("@/utils/resolveImg", () => ({
  resolveImg: (...args) => hoisted.resolveSpy(...args),
}));

import BlogMedia from "./BlogMedia";

describe("Testing BlogMedia", () => {
  beforeEach(() => {
    hoisted.resolveSpy.mockClear();
  });

  it("CP-BlogMedia1: Usa resolveImg(imagen), respeta alt custom y loading='lazy'", () => {
    const { container } = render(<BlogMedia imagen="/img/post.png" alt="Foto destacada" />);

    expect(hoisted.resolveSpy).toHaveBeenCalledWith("/img/post.png");

    const fig = container.querySelector("figure.blog-entry__media.mb-0");
    expect(fig).toBeInTheDocument();

    const img = fig.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/img/post.png");
    expect(img).toHaveAttribute("alt", "Foto destacada");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("CP-BlogMedia2: Alt por defecto cuando no se entrega 'alt'", () => {
    const { container } = render(<BlogMedia imagen="/img/otra.png" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("alt", "Imagen de la publicación");
  });

  it("CP-BlogMedia3: Si no hay 'imagen', resolveImg recibe undefined y usa valor por defecto del mock", () => {
    const { container } = render(<BlogMedia />);
    expect(hoisted.resolveSpy).toHaveBeenCalledWith(undefined);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "resolved-default.jpg");
  });

  it("CP-BlogMedia4: onError cambia src al placeholder 900x500", () => {
    const { container } = render(<BlogMedia imagen="/bad.png" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/bad.png");

    fireEvent.error(img);
    expect(img).toHaveAttribute("src", "https://placehold.co/900x500?text=Blog");
  });
});
