const STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "critical", label: "Crítico (<10%)" },
  { value: "low", label: "Bajo (<30%)" },
  { value: "healthy", label: "Saludable (>=30%)" },
];

const ReportFilters = ({
  categories = [],
  selectedCategory,
  selectedStatus,
  searchTerm,
  onCategoryChange,
  onStatusChange,
  onSearchChange,
  onReset,
}) => (
  <div className="admin-product-reports__filters">
    <div className="admin-product-reports__filter">
      <label htmlFor="report-category" className="admin-product-reports__label">
        Categoría
      </label>
      <select
        id="report-category"
        className="admin-product-reports__select"
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

    <div className="admin-product-reports__filter">
      <label htmlFor="report-status" className="admin-product-reports__label">
        Estado de stock
      </label>
      <select
        id="report-status"
        className="admin-product-reports__select"
        value={selectedStatus}
        onChange={(event) => onStatusChange?.(event.target.value)}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    <div className="admin-product-reports__filter admin-product-reports__filter--search">
      <label htmlFor="report-search" className="admin-product-reports__label">
        Buscar
      </label>
      <input
        id="report-search"
        type="search"
        className="admin-product-reports__input"
        placeholder="Nombre o ID"
        value={searchTerm}
        onChange={(event) => onSearchChange?.(event.target.value)}
      />
    </div>

    {onReset && (
      <div className="admin-product-reports__filter admin-product-reports__filter--actions">
        <button type="button" className="admin-product-reports__reset" onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    )}
  </div>
);

export default ReportFilters;
