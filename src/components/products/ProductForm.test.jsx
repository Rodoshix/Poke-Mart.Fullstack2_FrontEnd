import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductForm from "./ProductForm.jsx";

vi.mock("@/hooks/useProductFormState.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/hooks/useProductImageUpload.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/hooks/useProductValidation.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

const useProductFormState = (await import("@/hooks/useProductFormState.js")).default;
const useProductImageUpload = (await import("@/hooks/useProductImageUpload.js")).default;
const useProductValidation = (await import("@/hooks/useProductValidation.js")).default;

const buildFormState = (overrides = {}) => ({
  nombre: "  Ultra Ball ",
  categoria: " Pokeballs ",
  precio: " 15000 ",
  stock: " 10 ",
  imagen: "ultra-ball.png",
  imagenNombre: "ultra-ball.png",
  descripcion: "  Captura avanzada para entrenadores.  ",
  ...overrides,
});

const setupFormMocks = ({
  formState = buildFormState(),
  allowedCategories = ["Pokeballs", "Accesorios"],
  productId = 25,
  setFieldValue = vi.fn(),
  imageOverrides = {},
  validationReturn = [],
} = {}) => {
  useProductFormState.mockReturnValue({
    formState,
    setFormState: vi.fn(),
    setFieldValue,
    allowedCategories,
    productId,
  });

  useProductImageUpload.mockReturnValue({
    fileInputRef: { current: null },
    isDragging: false,
    previewSrc: "data:image/png;base64,AAA",
    isUploadedImage: true,
    maxImageSizeMb: 5,
    handleSelectFile: vi.fn(),
    handleRemoveImage: vi.fn(),
    handleFileInputChange: vi.fn(),
    handleDragOver: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDrop: vi.fn(),
    ...imageOverrides,
  });

  const validateFn = vi.fn().mockReturnValue(validationReturn);
  useProductValidation.mockReturnValue(validateFn);
  return { formState, setFieldValue, validateFn };
};

describe("Testing ProductForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductForm1: Envía los datos formateados cuando la validación es correcta", async () => {
    const { formState, validateFn } = setupFormMocks();
    const onSubmit = vi.fn().mockResolvedValue(null);
    const onCancel = vi.fn();
    render(<ProductForm initialProduct={{ id: 25 }} onSubmit={onSubmit} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(validateFn).toHaveBeenCalledTimes(1);

    expect(onSubmit).toHaveBeenCalledWith({
      id: 25,
      nombre: "Ultra Ball",
      categoria: "Pokeballs",
      precio: 15000,
      stock: 10,
      imagen: formState.imagen,
      imagenNombre: formState.imagenNombre,
      descripcion: "Captura avanzada para entrenadores.",
    });
  });

  it("CP-ProductForm2: Muestra los errores de validación y evita enviar la información", () => {
    setupFormMocks({ validationReturn: ["El nombre es requerido", "El stock debe ser mayor a 0"] });
    const onSubmit = vi.fn();

    render(<ProductForm initialProduct={null} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("El nombre es requerido")).toBeInTheDocument();
    expect(screen.getByText("El stock debe ser mayor a 0")).toBeInTheDocument();
  });

  it("CP-ProductForm3: Muestra el mensaje de error devuelto por onSubmit cuando falla", async () => {
    setupFormMocks();
    const onSubmit = vi.fn().mockRejectedValue(new Error("No se pudo guardar el producto."));

    render(<ProductForm initialProduct={null} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(await screen.findByText("No se pudo guardar el producto.")).toBeInTheDocument();
  });

  it("CP-ProductForm4: Permite cancelar y delega cambios de campo hacia setFieldValue", () => {
    const { setFieldValue } = setupFormMocks();
    const onCancel = vi.fn();

    render(<ProductForm initialProduct={null} onSubmit={vi.fn()} onCancel={onCancel} />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { name: "nombre", value: "Navaja" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(setFieldValue).toHaveBeenCalledWith("nombre", "Navaja");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
