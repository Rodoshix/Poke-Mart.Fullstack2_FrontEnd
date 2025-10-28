// src/components/about/SocialLinks.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SocialLinks from "./SocialLinks";

describe("Testing SocialLinks", () => {
  it("CP-Social1: Renderiza el heading y los 4 links por defecto con href/target/rel", () => {
    render(<SocialLinks />);

    // Heading
    expect(
      screen.getByRole("heading", { level: 3, name: /síguenos/i })
    ).toBeInTheDocument();

    // Links por defecto
    const labels = ["Facebook", "Instagram", "Twitter", "LinkedIn"];
    labels.forEach((label) => {
      const link = screen.getByRole("link", { name: label });
      expect(link).toBeInTheDocument();
      // href correcto
      const hrefStartsWith = {
        Facebook: "https://www.facebook.com/",
        Instagram: "https://www.instagram.com/",
        Twitter: "https://twitter.com/",
        LinkedIn: "https://www.linkedin.com/",
      }[label];
      expect(link).toHaveAttribute("href", hrefStartsWith);
      // seguridad
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("CP-Social2: Acepta links personalizados y NO muestra los defaults", () => {
    const custom = [
      { href: "https://t.me/pokemart", label: "Telegram" },
      { href: "https://youtube.com/@pokemart", label: "YouTube" },
    ];
    render(<SocialLinks links={custom} />);

    // Están los personalizados
    expect(screen.getByRole("link", { name: /telegram/i })).toHaveAttribute(
      "href",
      "https://t.me/pokemart"
    );
    expect(screen.getByRole("link", { name: /youtube/i })).toHaveAttribute(
      "href",
      "https://youtube.com/@pokemart"
    );

    // No están los defaults
    expect(screen.queryByRole("link", { name: /facebook/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /instagram/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /twitter/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /linkedin/i })).not.toBeInTheDocument();
  });

  it("CP-Social3: Estructura y clases: aside > card > heading + ul > li > a", () => {
    const { container } = render(<SocialLinks />);

    const aside = container.querySelector("aside.about-social");
    expect(aside).toBeInTheDocument();

    const card = aside?.querySelector("div.about-social__card");
    expect(card).toBeInTheDocument();

    const heading = card?.querySelector("h3.about-social__heading.h4.mb-3");
    expect(heading).toBeInTheDocument();

    const ul = card?.querySelector("ul.about-social__list");
    expect(ul).toBeInTheDocument();

    const lis = ul?.querySelectorAll("li");
    expect(lis && lis.length).toBe(4);

    const firstLink = ul?.querySelector("a.about-social__link");
    expect(firstLink).toBeInTheDocument();
  });

  it("CP-Social4: Cada link incluye el ícono decorativo con aria-hidden='true'", () => {
    render(<SocialLinks />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);

    links.forEach((a) => {
      const icon = a.querySelector("span.about-social__icon");
      expect(icon).toBeInTheDocument();
      expect(icon?.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("CP-Social5: Se renderiza sin links (array vacío) mostrando únicamente el heading", () => {
    const { container } = render(<SocialLinks links={[]} />);

    // Heading visible
    expect(
      screen.getByRole("heading", { level: 3, name: /síguenos/i })
    ).toBeInTheDocument();

    // Lista vacía de enlaces
    expect(screen.queryAllByRole("link")).toHaveLength(0);

    // UL existe pero sin LI
    const ul = container.querySelector("ul.about-social__list");
    expect(ul).toBeInTheDocument();
    expect(ul?.querySelectorAll("li").length).toBe(0);
  });
});
