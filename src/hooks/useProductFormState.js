import { useCallback, useEffect, useMemo, useState } from "react";

const buildInitialState = (initialProduct) => ({
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
  stockBase:
    initialProduct?.stockBase !== undefined && initialProduct?.stockBase !== null
      ? String(initialProduct.stockBase)
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

const useProductFormState = ({ initialProduct, categories }) => {
  const [formState, setFormState] = useState(() => buildInitialState(initialProduct));

  useEffect(() => {
    setFormState(buildInitialState(initialProduct));
  }, [initialProduct]);

  const setFieldValue = useCallback((name, value) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "imagen" ? { imagenNombre: "" } : {}),
    }));
  }, []);

  const initialCategory = initialProduct?.categoria ?? "";

  const allowedCategories = useMemo(() => {
    const set = new Set(
      (categories ?? [])
        .map((category) => (category ?? "").toString().trim())
        .filter(Boolean),
    );

    if (initialCategory) {
      set.add(initialCategory.trim());
    }

    if (formState.categoria) {
      set.add(formState.categoria.trim());
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [categories, initialCategory, formState.categoria]);

  const productId = initialProduct?.id ?? null;

  return {
    formState,
    setFormState,
    setFieldValue,
    allowedCategories,
    productId,
  };
};

export default useProductFormState;

