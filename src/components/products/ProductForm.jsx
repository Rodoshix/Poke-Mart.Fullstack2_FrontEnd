import { useEffect, useMemo, useRef, useState } from "react";
import { resolveImg } from "@/utils/resolveImg.js";

const ProductForm = ({
  initialProduct,
  onSubmit,
  onCancel,
  submitLabel = "Guardar cambios",
  categories = [],
}) => {
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
  const maxImageSizeMb = (MAX_IMAGE_SIZE / (1024 * 1024)).toFixed(1);
  const [formState, setFormState] = useState(() => ({
    nombre: initialProduct?.nombre ?? "",
    categoria: initialProduct?.categoria ?? "",
    precio:
      initialProduct?.precio !== undefined && initialProduct?.precio !== null
        ? String(initialProduct.precio)
        : "",
    stock:
      initialProduct?.stock !== undefined && initialProduct?.stock !== null
        ? String(initialProduct.stock)
        : "",
    imagen: initialProduct?.imagen ?? "",
    imagenNombre:
      initialProduct?.imagenNombre ??
      (initialProduct?.imagen
        ? initialProduct.imagen.split("/").pop() ||
          (/^data:/i.test(initialProduct.imagen) ? "Imagen personalizada" : "")
        : ""),
    descripcion: initialProduct?.descripcion ?? "",
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const productId = useMemo(() => initialProduct?.id ?? null, [initialProduct]);
  const allowedCategories = useMemo(() => {
    const set = new Set(
      (categories ?? [])
        .map((cat) => (cat ?? "").toString().trim())
        .filter((cat) => Boolean(cat)),
    );
    if (initialProduct?.categoria) {
      set.add(initialProduct.categoria.trim());
    }
    if (formState.categoria) {
      set.add(formState.categoria.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [categories, initialProduct?.categoria, formState.categoria]);

  const pushError = (message) => {
    setErrors((prev) => (prev.includes(message) ? prev : [...prev, message]));
  };

  useEffect(() => {
    setFormState({
      nombre: initialProduct?.nombre ?? "",
      categoria: initialProduct?.categoria ?? "",
      precio:
        initialProduct?.precio !== undefined && initialProduct?.precio !== null
          ? String(initialProduct.precio)
          : "",
      stock:
        initialProduct?.stock !== undefined && initialProduct?.stock !== null
          ? String(initialProduct.stock)
          : "",
      imagen: initialProduct?.imagen ?? "",
      imagenNombre:
        initialProduct?.imagenNombre ??
        (initialProduct?.imagen
          ? initialProduct.imagen.split("/").pop() ||
            (/^data:/i.test(initialProduct.imagen) ? "Imagen personalizada" : "")
          : ""),
      descripcion: initialProduct?.descripcion ?? "",
    });
    setErrors([]);
  }, [initialProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "imagen" ? value : value,
      ...(name === "imagen" ? { imagenNombre: "" } : {}),
    }));
  };

  const clearImageErrors = () => {
    setErrors((prev) => prev.filter((msg) => !msg.toLowerCase().includes("imagen")));
  };

  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      pushError("El archivo seleccionado debe ser una imagen.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      pushError(`La imagen supera el tamaño máximo permitido (${maxImageSizeMb} MB).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      clearImageErrors();
      setFormState((prev) => ({
        ...prev,
        imagen: typeof reader.result === "string" ? reader.result : prev.imagen,
        imagenNombre: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    processImageFile(file);
    event.target.value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer?.files?.[0];
    processImageFile(file);
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setFormState((prev) => ({
      ...prev,
      imagen: "",
      imagenNombre: "",
    }));
    clearImageErrors();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const previewSrc = useMemo(() => {
    if (!formState.imagen) return null;
    if (/^data:/i.test(formState.imagen)) return formState.imagen;
    return resolveImg(formState.imagen);
  }, [formState.imagen]);

  const isUploadedImage = useMemo(
    () => /^data:/i.test(formState.imagen ?? ""),
    [formState.imagen],
  );

  const validate = () => {
    const validationErrors = [];
    const nombre = formState.nombre.trim();
    const categoria = formState.categoria.trim();
    const precioRaw = formState.precio.trim();
    const stockRaw = formState.stock.trim();
    const imagen = formState.imagen.trim();
    const descripcion = formState.descripcion.trim();

    const precio = Number(precioRaw);
    const stock = Number(stockRaw);

    if (!nombre) validationErrors.push("El nombre es obligatorio.");
    if (!categoria) validationErrors.push("La categoría es obligatoria.");
    else if (!allowedCategories.includes(categoria))
      validationErrors.push("Selecciona una categoría válida.");
    if (!precioRaw) validationErrors.push("El precio es obligatorio.");
    if (!Number.isFinite(precio) || precio <= 0)
      validationErrors.push("El precio debe ser un número mayor a 0.");
    if (!stockRaw) validationErrors.push("El stock es obligatorio.");
    if (!Number.isFinite(stock) || stock < 0)
      validationErrors.push("El stock debe ser un número igual o mayor a 0.");
    const hasImage = Boolean(imagen);
    if (!hasImage) {
      validationErrors.push("Debes cargar una imagen para el producto.");
    } else if (
      !/^data:/i.test(imagen) &&
      !(initialProduct?.imagen && imagen === initialProduct.imagen)
    ) {
      validationErrors.push(
        "La imagen debe cargarse desde tu equipo como archivo o mantener la existente.",
      );
    }
    if (!descripcion || descripcion.length < 10)
      validationErrors.push("Incluye una descripción de al menos 10 caracteres.");

    return {
      validationErrors,
      nombre,
      categoria,
      precio,
      stock,
      imagen,
      descripcion,
      imagenNombre: formState.imagenNombre,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (typeof onSubmit !== "function" || !productId) {
      return;
    }

    setIsSubmitting(true);
    const {
      validationErrors,
      nombre,
      categoria,
      precio,
      stock,
      imagen,
      descripcion,
      imagenNombre,
    } = validate();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        id: productId,
        nombre,
        categoria,
        precio,
        stock,
        imagen,
        imagenNombre,
        descripcion,
      });
      setErrors([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar el producto";
      setErrors([message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-product-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-product-form__grid">
        <div className="admin-product-form__group">
          <label className="admin-product-form__label" htmlFor="product-id">
            ID del producto
          </label>
          <input
            id="product-id"
            type="text"
            className="admin-product-form__input"
            value={productId ?? ""}
            disabled
            readOnly
          />
        </div>

        <div className="admin-product-form__group">
          <label className="admin-product-form__label" htmlFor="product-name">
            Nombre
          </label>
          <input
            id="product-name"
            name="nombre"
            type="text"
            className="admin-product-form__input"
            value={formState.nombre}
            onChange={handleChange}
            required
            maxLength={120}
          />
        </div>

        <div className="admin-product-form__group">
          <label className="admin-product-form__label" htmlFor="product-category">
            Categoría
          </label>
          <select
            id="product-category"
            name="categoria"
            className="admin-product-form__input"
            value={formState.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            {allowedCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-product-form__group">
          <label className="admin-product-form__label" htmlFor="product-price">
            Precio (CLP)
          </label>
          <input
            id="product-price"
            name="precio"
            type="number"
            min="1"
            step="1"
            className="admin-product-form__input"
            value={formState.precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-product-form__group">
          <label className="admin-product-form__label" htmlFor="product-stock">
            Stock disponible
          </label>
          <input
            id="product-stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            className="admin-product-form__input"
            value={formState.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-product-form__group admin-product-form__group--full">
          <span className="admin-product-form__label">Imagen desde tu equipo</span>
          <div
            className={`admin-product-form__dropzone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="admin-product-form__dropzone-content">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt={formState.nombre || "Vista previa"}
                  className="admin-product-form__preview"
                />
              ) : (
                <span>Arrastra una imagen o selecciónala desde tu equipo</span>
              )}
              <div className="admin-product-form__dropzone-actions">
                <button
                  type="button"
                  className="admin-product-form__button admin-product-form__button--ghost"
                  onClick={handleSelectFile}
                >
                  Seleccionar imagen
                </button>
                {formState.imagen && (
                  <button
                    type="button"
                    className="admin-product-form__button admin-product-form__button--ghost"
                    onClick={handleRemoveImage}
                  >
                    Quitar imagen
                  </button>
                )}
              </div>
              {!isUploadedImage && formState.imagen && (
                <small className="admin-product-form__help">
                  Imagen actual: {formState.imagenNombre || formState.imagen}. Puedes mantenerla o
                  reemplazarla cargando un archivo.
                </small>
              )}
              {formState.imagenNombre && (
                <small className="admin-product-form__image-name">
                  Imagen cargada: {formState.imagenNombre}
                </small>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="admin-product-form__file-input"
                onChange={handleFileInputChange}
              />
            </div>
          </div>
          <small className="admin-product-form__help">
            Arrastra una imagen o selecciónala desde tu equipo. Para productos nuevos es obligatorio.
            Tamaño máximo {maxImageSizeMb} MB.
          </small>
        </div>
      </div>

      <div className="admin-product-form__group">
        <label className="admin-product-form__label" htmlFor="product-description">
          Descripción
        </label>
        <textarea
          id="product-description"
          name="descripcion"
          className="admin-product-form__textarea"
          rows={6}
          value={formState.descripcion}
          onChange={handleChange}
          required
          minLength={10}
        />
      </div>

      {errors.length > 0 && (
        <div className="admin-product-form__errors" role="alert">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="admin-product-form__actions">
        {onCancel && (
          <button
            type="button"
            className="admin-product-form__button admin-product-form__button--secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="admin-product-form__button admin-product-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
