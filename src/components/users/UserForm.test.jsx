import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserForm from "./UserForm.jsx";

vi.mock("@/components/registro/validators", () => ({
  __esModule: true,
  formatRun: vi.fn((value) => `formatted-${value}`),
  norm: { run: vi.fn((value) => `normalized-${value}`) },
}));

vi.mock("@/hooks/useUserFormState.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/hooks/useUserValidation.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

import { formatRun, norm } from "@/components/registro/validators";
import useUserFormState from "@/hooks/useUserFormState.js";
import useUserValidation from "@/hooks/useUserValidation.js";

const baseFormState = {
  username: "  entrenador  ",
  password: "  nuevaClave ",
  passwordConfirm: "  nuevaClave ",
  role: " cliente ",
  nombre: " Ash ",
  apellido: " Ketchum ",
  run: "12.345.678-9",
  fechaNacimiento: "2000-01-01 ",
  region: "Kanto ",
  comuna: "Pallet ",
  direccion: "  Calle   Principal   123 ",
  email: " ash@example.com ",
  registeredAt: "2024-02-01T00:00:00.000Z",
};

const configureFormStateMock = (options = {}) => {
  const hookValues = {
    formState: { ...baseFormState, ...(options.formState ?? {}) },
    handleChange: options.handleChange ?? vi.fn(),
    handleRunBlur: options.handleRunBlur ?? vi.fn(),
    regionOptions:
      options.regionOptions ??
      [
        { value: "", label: "Selecciona una región" },
        { value: "Kanto", label: "Kanto" },
      ],
    comunaOptions: options.comunaOptions ?? [{ value: "Pallet", label: "Pallet" }],
    shouldShowPasswordConfirm: options.shouldShowPasswordConfirm ?? true,
    userId: options.userId ?? 25,
  };

  useUserFormState.mockReturnValue(hookValues);
  return hookValues;
};

describe("Testing UserForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-UserForm1: Envía los datos normalizados cuando la validación es satisfactoria", async () => {
    const { formState, userId } = configureFormStateMock();
    const validate = vi.fn().mockReturnValue([]);
    useUserValidation.mockReturnValue(validate);

    const onSubmit = vi.fn().mockResolvedValue(null);
    const onCancel = vi.fn();
    const initialUser = { id: userId, password: "old-password", registeredAt: "2020-05-01T10:00:00.000Z" };

    render(<UserForm initialUser={initialUser} onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(validate).toHaveBeenCalledTimes(1);

    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted).toEqual({
      id: userId,
      username: "entrenador",
      password: "nuevaClave",
      role: "cliente",
      nombre: "Ash",
      apellido: "Ketchum",
      run: "formatted-normalized-12.345.678-9",
      fechaNacimiento: "2000-01-01",
      region: "Kanto",
      comuna: "Pallet",
      direccion: "Calle Principal 123",
      email: "ash@example.com",
      registeredAt: "2020-05-01T10:00:00.000Z",
    });
    expect(norm.run).toHaveBeenCalledWith(formState.run);
    expect(formatRun).toHaveBeenCalledWith(`normalized-${formState.run}`);
  });

  it("CP-UserForm2: Muestra la lista de errores cuando la validación falla", () => {
    configureFormStateMock();
    useUserValidation.mockReturnValue(vi.fn().mockReturnValue(["Error 1", "Error 2"]));

    const onSubmit = vi.fn();
    render(<UserForm initialUser={null} onSubmit={onSubmit} isNew />);

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Error 1")).toBeInTheDocument();
    expect(screen.getByText("Error 2")).toBeInTheDocument();
  });

  it("CP-UserForm3: Notifica el mensaje del error cuando onSubmit rechaza la operación", async () => {
    configureFormStateMock();
    useUserValidation.mockReturnValue(vi.fn().mockReturnValue([]));

    const onSubmit = vi.fn().mockRejectedValue(new Error("No se pudo guardar"));
    render(<UserForm initialUser={null} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByText("No se pudo guardar")).toBeInTheDocument();
  });

  it("CP-UserForm4: Mantiene la contraseña original si el campo queda vacío y permite cancelar", async () => {
    const initialUser = { id: 99, password: "password-original" };
    const { formState } = configureFormStateMock({
      formState: { ...baseFormState, password: "   ", passwordConfirm: "" },
      shouldShowPasswordConfirm: false,
      userId: initialUser.id,
    });
    useUserValidation.mockReturnValue(vi.fn().mockReturnValue([]));

    const onSubmit = vi.fn().mockResolvedValue(null);
    const onCancel = vi.fn();

    render(
      <UserForm
        initialUser={initialUser}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitLabel="Guardar cambios"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0].password).toBe("password-original");

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(norm.run).toHaveBeenCalledWith(formState.run);
  });
});
