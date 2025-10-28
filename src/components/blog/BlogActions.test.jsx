// src/components/blog/BlogActions.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import BlogActions from "./BlogActions";

function renderWithRouter(ui) {
  return render(<MemoryRouter initialEntries={["/blog/1"]}>{ui}</MemoryRouter>);
}

describe("Testing BlogActions", () => {
  it("CP-BlogActions1: Renderiza el contenedor de acciones", () => {
    const { container } = renderWithRouter(<BlogActions />);
    const wrapper = container.querySelector("div.blog-entry__actions");
    expect(wrapper).toBeInTheDocument();
  });

  it("CP-BlogActions2: Renderiza el link 'Volver al blog' con href='/blog' y clase", () => {
    renderWithRouter(<BlogActions />);
    const link = screen.getByRole("link", { name: /volver al blog/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/blog");
    expect(link).toHaveClass("blog-entry__back");
  });

  it("CP-BlogActions3: Incluye la flecha hacia la izquierda (←) en el texto", () => {
    renderWithRouter(<BlogActions />);
    const link = screen.getByRole("link", { name: /volver al blog/i });
    expect(link.textContent).toContain("←");
  });
});
