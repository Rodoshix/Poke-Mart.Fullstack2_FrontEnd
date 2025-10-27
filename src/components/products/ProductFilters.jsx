const SORT_OPTIONS = [
  { value: "id:asc", label: "ID: menor a mayor" },
  { value: "id:desc", label: "ID: mayor a menor" },
  { value: "price:desc", label: "Precio: mayor a menor" },
  { value: "price:asc", label: "Precio: menor a mayor" },
  { value: "stock:desc", label: "Stock: mayor a menor" },
  { value: "stock:asc", label: "Stock: menor a mayor" },
];

const ProductFilters = ({
  searchTerm,
  selectedCategory,
  sortOption,
  categories = [],
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
}) => (
  <div className="admin-product-filters">
    <div className="admin-product-filters__group">
      <label className="admin-product-filters__label" htmlFor="product-search">
        Buscar
      </label>
      <input
        id="product-search"
        type="search"
        className="admin-product-filters__input"
        placeholder="Buscar por nombre o ID"
        value={searchTerm}
        onChange={(event) => onSearchChange?.(event.target.value)}
      />
    </div>

    <div className="admin-product-filters__group">
      <label className="admin-product-filters__label" htmlFor="product-category">
        Categoría
      </label>
      <select
        id="product-category"
        className="admin-product-filters__select"
        value={selectedCategory}
        onChange={(event) => onCategoryChange?.(event.target.value)}
      >
        <option value="">Todas</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>

    <div className="admin-product-filters__group">
      <label className="admin-product-filters__label" htmlFor="product-sort">
        Ordenar por
      </label>
      <select
        id="product-sort"
        className="admin-product-filters__select"
        value={sortOption}
        onChange={(event) => onSortChange?.(event.target.value)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    {onReset && (
      <div className="admin-product-filters__group admin-product-filters__group--actions">
        <button type="button" className="admin-product-filters__reset" onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    )}
  </div>
);

export default ProductFilters;
