import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactInfoCard from "./ContactInfoCard.jsx";

describe("Testing ContactInfoCard", () => {
  it("CP-ContactInfoCard1: Muestra título, dirección y enlaces cuando existen", () => {
    render(
      <ContactInfoCard
        variant="secondary"
        title="Poké Mart Central"
        addressLines={["Ruta 1", "Pueblo Paleta"]}
        email="contacto@pokemart.cl"
        phone="+56 9 1234 5678"
      />,
    );

    expect(screen.getByText("Poké Mart Central")).toBeInTheDocument();
    expect(screen.getByText("Ruta 1")).toBeInTheDocument();
    expect(screen.getByText("Pueblo Paleta")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "contacto@pokemart.cl" })).toHaveAttribute(
      "href",
      "mailto:contacto@pokemart.cl",
    );
    expect(screen.getByText("+56 9 1234 5678")).toBeInTheDocument();
  });

  it("CP-ContactInfoCard2: Omite secciones opcionales cuando faltan datos", () => {
    const { container } = render(<ContactInfoCard title="Sucursal Misty" addressLines={[]} />);

    expect(container.querySelector(".contacto-card__link")).toBeNull();
    expect(container.querySelector(".contacto-card__phone")).toBeNull();
  });
});
