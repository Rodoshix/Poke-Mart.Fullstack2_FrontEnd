import { useCallback } from "react";

const useProductValidation = ({ formState, allowedCategories }) =>
  useCallback(() => {
    const validationErrors = [];

    const nombre = (formState.nombre ?? "").trim();
    const categoria = (formState.categoria ?? "").trim();
    const descripcion = (formState.descripcion ?? "").trim();
    const precioValue = Number(formState.precio);
    const stockValue = Number(formState.stock);

    if (nombre.length < 3) {
      validationErrors.push("El nombre debe tener al menos 3 caracteres.");
    }

    if (!categoria) {
      validationErrors.push("Debes seleccionar una categoría.");
    } else if (allowedCategories.length > 0 && !allowedCategories.includes(categoria)) {
      validationErrors.push("Selecciona una categoría válida.");
    }

    if (!Number.isFinite(precioValue) || precioValue <= 0) {
      validationErrors.push("Ingresa un precio válido para el producto.");
    }

    if (!Number.isFinite(stockValue) || stockValue < 0 || !Number.isInteger(stockValue)) {
      validationErrors.push("El stock debe ser un número entero mayor o igual a 0.");
    }

    if (!formState.imagen) {
      validationErrors.push("Debes cargar una imagen para el producto.");
    }

    if (descripcion.length < 10) {
      validationErrors.push("La descripción debe tener al menos 10 caracteres.");
    }

    return validationErrors;
  }, [allowedCategories, formState.categoria, formState.descripcion, formState.imagen, formState.nombre, formState.precio, formState.stock]);

export default useProductValidation;

