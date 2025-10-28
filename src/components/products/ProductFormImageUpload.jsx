const ProductFormImageUpload = ({
  formState,
  previewSrc,
  fileInputRef,
  isDragging,
  isUploadedImage,
  maxImageSizeMb,
  onSelectFile,
  onRemoveImage,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
}) => (
  <div className="admin-product-form__group admin-product-form__group--full">
    <span className="admin-product-form__label">Imagen desde tu equipo</span>
    <div
      className={`admin-product-form__dropzone ${isDragging ? "is-dragging" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
            onClick={onSelectFile}
          >
            Seleccionar imagen
          </button>
          {formState.imagen && (
            <button
              type="button"
              className="admin-product-form__button admin-product-form__button--ghost"
              onClick={onRemoveImage}
            >
              Quitar imagen
            </button>
          )}
        </div>
        {!isUploadedImage && formState.imagen && (
          <small className="admin-product-form__help">
            Imagen actual: {formState.imagenNombre || formState.imagen}. Puedes mantenerla o reemplazarla cargando un archivo.
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
          onChange={onFileChange}
        />
      </div>
    </div>
    <small className="admin-product-form__help">
      Arrastra una imagen o selecciónala desde tu equipo. Para productos nuevos es obligatorio. Tamaño máximo {maxImageSizeMb} MB.
    </small>
  </div>
);

export default ProductFormImageUpload;

