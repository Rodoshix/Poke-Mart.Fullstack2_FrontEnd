const ProductFormFooter = ({ errors, onCancel, isSubmitting, submitLabel }) => (
  <>
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
  </>
);

export default ProductFormFooter;

