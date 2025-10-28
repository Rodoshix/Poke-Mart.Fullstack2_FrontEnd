import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductFormImageUpload from "./ProductFormImageUpload.jsx";

describe("Testing ProductFormImageUpload", () => {
  const baseProps = {
    formState: {
      nombre: "Pikachu Plush",
      imagen: "pikachu.png",
      imagenNombre: "pikachu.png",
    },
    previewSrc: "data:image/png;base64,AAA",
    fileInputRef: { current: null },
    isDragging: false,
    isUploadedImage: true,
    maxImageSizeMb: 5,
    onSelectFile: vi.fn(),
    onRemoveImage: vi.fn(),
    onFileChange: vi.fn(),
    onDragOver: vi.fn(),
    onDragLeave: vi.fn(),
    onDrop: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CP-ProductFormImageUpload1: Muestra la imagen de vista previa y acciones disponibles", () => {
    render(<ProductFormImageUpload {...baseProps} />);

    expect(screen.getByAltText("Pikachu Plush")).toHaveAttribute("src", "data:image/png;base64,AAA");
    expect(screen.getByRole("button", { name: "Seleccionar imagen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quitar imagen" })).toBeInTheDocument();
    expect(
      screen.getByText(/Tamaño máximo 5 MB/),
    ).toBeInTheDocument();
  });

  it("CP-ProductFormImageUpload2: Indica imagen actual cuando no se ha subido un archivo nuevo", () => {
    const props = {
      ...baseProps,
      isUploadedImage: false,
    };
    render(<ProductFormImageUpload {...props} />);

    expect(screen.getByText(/Imagen actual:/)).toBeInTheDocument();
    expect(
      screen.getByText(/Imagen cargada: pikachu\.png/),
    ).toBeInTheDocument();
  });

  it("CP-ProductFormImageUpload3: Reacciona a eventos de drag and drop y botones", () => {
    const props = {
      ...baseProps,
      isDragging: true,
    };
    render(<ProductFormImageUpload {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Seleccionar imagen" }));
    fireEvent.click(screen.getByRole("button", { name: "Quitar imagen" }));
    const dropzoneElement = screen
      .getByRole("button", { name: "Seleccionar imagen" })
      .closest(".admin-product-form__dropzone-content")
      ?.parentElement;

    expect(dropzoneElement).not.toBeNull();
    const dropzone = dropzoneElement;
    if (!dropzone) {
      throw new Error("Dropzone not found");
    }

    expect(dropzone.className).toContain("admin-product-form__dropzone");
    expect(dropzone.className).toContain("is-dragging");

    fireEvent.dragOver(dropzone);
    fireEvent.dragLeave(dropzone);
    fireEvent.drop(dropzone);

    expect(props.onSelectFile).toHaveBeenCalledTimes(1);
    expect(props.onRemoveImage).toHaveBeenCalledTimes(1);
    expect(props.onDragOver).toHaveBeenCalledTimes(1);
    expect(props.onDragLeave).toHaveBeenCalledTimes(1);
    expect(props.onDrop).toHaveBeenCalledTimes(1);
  });
});
