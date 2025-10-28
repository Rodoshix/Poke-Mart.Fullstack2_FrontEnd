import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReportPanel from "./ReportPanel.jsx";

describe("Testing ReportPanel", () => {
  it("CP-ReportPanel1: Renderiza título, subtítulo y contenido hijo", () => {
    render(
      <ReportPanel title="Panel de prueba" subtitle="Subtítulo descriptivo">
        <div>Contenido interno</div>
      </ReportPanel>,
    );

    expect(screen.getByRole("heading", { name: "Panel de prueba" })).toBeInTheDocument();
    expect(screen.getByText("Subtítulo descriptivo")).toBeInTheDocument();
    expect(screen.getByText("Contenido interno")).toBeInTheDocument();
  });

  it("CP-ReportPanel2: Omite subtítulo cuando no se entrega", () => {
    render(
      <ReportPanel title="Solo título">
        <span>Sin subtítulo</span>
      </ReportPanel>,
    );

    expect(screen.queryByText("Subtítulo descriptivo")).toBeNull();
  });
});
