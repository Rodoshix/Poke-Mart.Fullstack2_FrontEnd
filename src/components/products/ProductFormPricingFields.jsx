const ProductFormPricingFields = ({ formState, onChange }) => (
  <>
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
        onChange={onChange}
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
        onChange={onChange}
        required
      />
    </div>
  </>
);

export default ProductFormPricingFields;

