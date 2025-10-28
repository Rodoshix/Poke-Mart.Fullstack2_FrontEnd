const ProductFormPrimaryFields = ({ formState, allowedCategories, onChange }) => (
  <>
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
        onChange={onChange}
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
        onChange={onChange}
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
  </>
);

export default ProductFormPrimaryFields;

