import { useMemo, useRef, useState } from "react";
import { resolveImg } from "@/utils/resolveImg.js";

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

const useProductImageUpload = ({ formState, setFormState, onError, onClearImageErrors }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const previewSrc = useMemo(() => {
    if (!formState.imagen) return null;
    return resolveImg(formState.imagen);
  }, [formState.imagen]);

  const isUploadedImage = useMemo(
    () => /^data:/i.test(formState.imagen ?? ""),
    [formState.imagen],
  );

  const maxImageSizeMb = useMemo(() => (MAX_IMAGE_SIZE / (1024 * 1024)).toFixed(1), []);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onError?.("El archivo seleccionado debe ser una imagen.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      onError?.(`La imagen supera el tamaño máximo permitido (${maxImageSizeMb} MB).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onClearImageErrors?.();
      setFormState((prev) => ({
        ...prev,
        imagen: typeof reader.result === "string" ? reader.result : prev.imagen,
        imagenNombre: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    onClearImageErrors?.();
    setFormState((prev) => ({
      ...prev,
      imagen: "",
      imagenNombre: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    processFile(file);
    event.target.value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
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
    processFile(file);
  };

  return {
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
  };
};

export default useProductImageUpload;

