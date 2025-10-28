// src/components/blog/BlogBreadcrumb.test.jsx
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import BlogBreadcrumb from "./BlogBreadcrumb";

function renderWithRouter(ui) {
  return render(<MemoryRouter initialEntries={["/blog/123"]}>{ui}</MemoryRouter>);
}

describe("Testing BlogBreadcrumb", () => {
  it("CP-Bc1: Renderiza <nav> con aria-label 'Migas de pan' y título por defecto 'Detalle'", () => {
    const { container } = renderWithRouter(<BlogBreadcrumb />);
    const nav = screen.getByRole("navigation", { name: /migas de pan/i });
    expect(nav).toBeInTheDocument();

    const { getByText } = within(nav);
    const titleEl = container.querySelector("#breadcrumbTitle");
    expect(titleEl).toBeInTheDocument();
    expect(getByText("Detalle")).toBeInTheDocument();
  });

  it("CP-Bc2: Enlaces Home y Blog con href correctos y clase", () => {
    renderWithRouter(<BlogBreadcrumb />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).toHaveClass("blog-breadcrumb__link");

    const blogLink = screen.getByRole("link", { name: /blog/i });
    expect(blogLink).toHaveAttribute("href", "/blog");
    expect(blogLink).toHaveClass("blog-breadcrumb__link");
  });

  it("CP-Bc3: Muestra exactamente dos separadores '/' con las clases de estilo", () => {
    const { container } = renderWithRouter(<BlogBreadcrumb />);
    const seps = container.querySelectorAll(".mx-2.text-body-secondary");
    expect(seps.length).toBe(2);
    seps.forEach((el) => expect(el.textContent).toBe("/"));
  });

  it("CP-Bc4: Acepta título personalizado", () => {
    renderWithRouter(<BlogBreadcrumb title="Guía avanzada" />);
    expect(screen.getByText("Guía avanzada")).toBeInTheDocument();
  });
});
