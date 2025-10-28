import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserFormLocation from "./UserFormLocation.jsx";

describe("Testing UserFormLocation", () => {
  const regionOptions = [
    { value: "", label: "Selecciona una región" },
    { value: "Metropolitana", label: "Metropolitana" },
  ];
  const comunaOptions = [
    { value: "Santiago", label: "Santiago" },
    { value: "Providencia", label: "Providencia" },
  ];

  let props;

  beforeEach(() => {
    vi.clearAllMocks();
    props = {
      formState: {
        region: "Metropolitana",
        comuna: "Santiago",
        direccion: "Calle Falsa 123",
      },
      regionOptions,
      comunaOptions,
      onChange: vi.fn(),
    };
  });

  it("CP-UserFormLocation1: Despliega opciones de región y comuna con valores actuales", () => {
    render(<UserFormLocation {...props} />);

    expect(screen.getByLabelText("Región")).toHaveDisplayValue("Metropolitana");
    expect(screen.getByLabelText("Comuna")).toHaveDisplayValue("Santiago");
    expect(screen.getByLabelText("Dirección")).toHaveValue("Calle Falsa 123");
    expect(screen.getByRole("option", { name: "Selecciona una región" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Providencia" })).toBeInTheDocument();
  });

  it("CP-UserFormLocation2: Emite cambios cuando se seleccionan nuevas opciones", () => {
    render(<UserFormLocation {...props} />);

    fireEvent.change(screen.getByLabelText("Región"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Comuna"), { target: { value: "Providencia" } });
    fireEvent.change(screen.getByLabelText("Dirección"), { target: { value: "Calle Falsa 123 depto 101" } });

    expect(props.onChange).toHaveBeenCalledTimes(3);
  });
});
