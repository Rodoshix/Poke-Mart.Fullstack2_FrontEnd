import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserFormCredentials from "./UserFormCredentials.jsx";

const roleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "cliente", label: "Cliente" },
];

describe("Testing UserFormCredentials", () => {
  let baseProps;

  beforeEach(() => {
    vi.clearAllMocks();
    baseProps = {
      userId: 42,
      formState: {
        username: "ash",
        password: "pikachu",
        passwordConfirm: "",
        role: "cliente",
      },
      roleOptions,
      onChange: vi.fn(),
      shouldShowPasswordConfirm: false,
      isNew: false,
    };
  });

  it("CP-UserFormCredentials1: Muestra datos básicos y oculta confirmación cuando no corresponde", () => {
    render(<UserFormCredentials {...baseProps} />);

    expect(screen.getByLabelText("ID")).toHaveValue("42");
    expect(screen.getByLabelText("Usuario")).toHaveValue("ash");
    expect(screen.getByLabelText("Contraseña (deja vacío para conservar)")).toHaveValue("pikachu");
    expect(screen.getByLabelText("Rol")).toHaveDisplayValue("Cliente");
    expect(screen.queryByLabelText("Confirmar contraseña")).toBeNull();
  });

  it("CP-UserFormCredentials2: Permite editar y dispara onChange con confirmación visible", () => {
    render(
      <UserFormCredentials
        {...baseProps}
        shouldShowPasswordConfirm
        isNew
      />,
    );

    fireEvent.change(screen.getByLabelText("Usuario"), { target: { value: "ketchum" } });
    fireEvent.change(screen.getByLabelText("Rol"), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText("Confirmar contraseña"), { target: { value: "pikachu2" } });

    expect(baseProps.onChange).toHaveBeenCalled();
    expect(screen.getByLabelText(/Contraseña/)).toHaveAttribute("placeholder", "Ingresa una contraseña");
    expect(screen.getByLabelText("Confirmar contraseña")).toBeInTheDocument();
  });
});
