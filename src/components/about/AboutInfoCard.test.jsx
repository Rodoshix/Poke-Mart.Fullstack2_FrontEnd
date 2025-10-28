// src/components/about/AboutInfoCard.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutInfoCard from "./AboutInfoCard";
import { within } from "@testing-library/react";

describe("Testing AboutInfoCard", () => {
  it("CP-About1: Renderiza título, nombre de dirección, líneas y texto por defecto", () => {
    render(<AboutInfoCard />);

    expect(
      screen.getByRole("heading", { name: /dónde estamos/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Poké Mart — Sucursal Central")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Av. Kanto 151, Ciudad Carmín")
    ).toBeInTheDocument();
    expect(screen.getByText("Región de Kanto")).toBeInTheDocument();

    expect(
      screen.getByText(/desde nuestra base central/i)
    ).toBeInTheDocument();
  });

  it("CP-About2: Renderiza props personalizados y children, ocultando el texto por defecto", () => {
    const customAddress = {
      name: "Poké Mart — Sucursal Johto",
      lines: ["Ruta 34 #123", "Ciudad Trigal"],
    };

    render(
      <AboutInfoCard title="Nuestra ubicación" address={customAddress}>
        En Johto manejamos soporte y distribución regional.
      </AboutInfoCard>
    );

    expect(
      screen.getByRole("heading", { name: /nuestra ubicación/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Poké Mart — Sucursal Johto")
    ).toBeInTheDocument();
    expect(screen.getByText("Ruta 34 #123")).toBeInTheDocument();
    expect(screen.getByText("Ciudad Trigal")).toBeInTheDocument();

    expect(
      screen.getByText(/soporte y distribución regional/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/desde nuestra base central/i)
    ).not.toBeInTheDocument();
  });

  it("CP-About3: No falla si address no trae lines (falsy) y muestra solo el nombre", () => {
     render(
       <AboutInfoCard
         address={{ name: "Poké Mart — Solo Nombre", lines: undefined }}
       />
     );
 
     const nameEl = screen.getByText("Poké Mart — Solo Nombre");
     const addrEl = nameEl.closest("address");
     expect(addrEl).not.toBeNull();
 
     const divsInsideAddress = addrEl.querySelectorAll("div");
     expect(divsInsideAddress).toHaveLength(1);
 
     const { queryByText } = within(addrEl);
     expect(queryByText(/av\.|ruta|ciudad/i)).not.toBeInTheDocument();
 
     expect(screen.getByText(/desde nuestra base central/i)).toBeInTheDocument();
   });

  it("CP-About4: El contenido de la dirección está dentro de un <address>", () => {
    render(<AboutInfoCard />);
    const name = screen.getByText("Poké Mart — Sucursal Central");
    const addressEl = name.closest("address");

    expect(addressEl).not.toBeNull();
    expect(addressEl).toContainElement(
      screen.getByText("Av. Kanto 151, Ciudad Carmín")
    );
    expect(addressEl).toContainElement(screen.getByText("Región de Kanto"));
  });

  it("CP-About5: Usa valores por defecto si se pasa address=undefined explícitamente", () => {
    render(<AboutInfoCard address={undefined} />);

    expect(
      screen.getByRole("heading", { name: /dónde estamos/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Poké Mart — Sucursal Central")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Av. Kanto 151, Ciudad Carmín")
    ).toBeInTheDocument();
    expect(screen.getByText("Región de Kanto")).toBeInTheDocument();
  });
});
