const ProductFormDescription = ({ value, onChange }) => (
  <div className="admin-product-form__group">
    <label className="admin-product-form__label" htmlFor="product-description">
      Descripción
    </label>
    <textarea
      id="product-description"
      name="descripcion"
      className="admin-product-form__textarea"
      rows={6}
      value={value}
      onChange={onChange}
      required
      minLength={10}
    />
  </div>
);

export default ProductFormDescription;

