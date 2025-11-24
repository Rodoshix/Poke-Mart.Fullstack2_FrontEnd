import { useCallback, useState } from "react";
import useProductFormState from "@/hooks/useProductFormState.js";
import useProductImageUpload from "@/hooks/useProductImageUpload.js";
import useProductValidation from "@/hooks/useProductValidation.js";
import ProductFormPrimaryFields from "@/components/products/ProductFormPrimaryFields.jsx";
import ProductFormPricingFields from "@/components/products/ProductFormPricingFields.jsx";
import ProductFormImageUpload from "@/components/products/ProductFormImageUpload.jsx";
import ProductFormDescription from "@/components/products/ProductFormDescription.jsx";
import ProductFormFooter from "@/components/products/ProductFormFooter.jsx";

const ProductForm = ({ initialProduct, onSubmit, onCancel, submitLabel = "Guardar cambios", categories = [] }) => {
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formState,
    setFormState,
    setFieldValue,
    allowedCategories,
    productId,
  } = useProductFormState({ initialProduct, categories });

  const pushError = useCallback((message) => {
    setErrors((prev) => (prev.includes(message) ? prev : [...prev, message]));
  }, []);

  const clearImageErrors = useCallback(() => {
    setErrors((prev) => prev.filter((msg) => !msg.toLowerCase().includes("imagen")));
  }, []);

  const {
    fileInputRef,
    isDragging,
    previewSrc,
    isUploadedImage,
    maxImageSizeMb,
    handleSelectFile,
    handleRemoveImage,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useProductImageUpload({
    formState,
    setFormState,
    onError: pushError,
    onClearImageErrors: clearImageErrors,
  });

  const validateForm = useProductValidation({
    formState,
    allowedCategories,
    productId,
  });

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFieldValue(name, value);
  }, [setFieldValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    const payload = {
      id: productId,
      nombre: formState.nombre.trim(),
      categoria: formState.categoria.trim(),
      precio: Number(formState.precio),
      stock: Number(formState.stock),
      imagen: formState.imagen,
      imagenNombre: formState.imagenNombre,
      descripcion: formState.descripcion.trim(),
    };
    if (formState.stockBase !== "" && formState.stockBase !== undefined) {
      payload.stockBase = Number(formState.stockBase);
    }

    try {
      await onSubmit?.(payload);
    } catch (error) {
      pushError(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-product-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-product-form__grid">
        <ProductFormPrimaryFields
          formState={formState}
          allowedCategories={allowedCategories}
          onChange={handleChange}
        />
        <ProductFormPricingFields formState={formState} onChange={handleChange} />
        <ProductFormImageUpload
          formState={formState}
          previewSrc={previewSrc}
          fileInputRef={fileInputRef}
          isDragging={isDragging}
          isUploadedImage={isUploadedImage}
          maxImageSizeMb={maxImageSizeMb}
          onSelectFile={handleSelectFile}
          onRemoveImage={handleRemoveImage}
          onFileChange={handleFileInputChange}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      </div>

      <ProductFormDescription value={formState.descripcion} onChange={handleChange} />

      <ProductFormFooter
        errors={errors}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
      />
    </form>
  );
};

export default ProductForm;


