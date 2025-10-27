const ORDER_OPTIONS = [
  { value: "createdAt:desc", label: "Más recientes primero" },
  { value: "createdAt:asc", label: "Más antiguos primero" },
  { value: "total:desc", label: "Precio de mayor a menor" },
  { value: "total:asc", label: "Precio de menor a mayor" },
];

const OrderFilters = ({ searchTerm, sortOption, onSearchChange, onSortChange }) => (
  <div className="admin-order-filters">
    <div className="admin-order-filters__group">
      <label className="admin-order-filters__label" htmlFor="order-search">
        Buscar por ID
      </label>
      <input
        id="order-search"
        className="admin-order-filters__input"
        type="search"
        placeholder="Ej: ORD-1021"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        autoComplete="off"
      />
    </div>

    <div className="admin-order-filters__group">
      <label className="admin-order-filters__label" htmlFor="order-sort">
        Ordenar por
      </label>
      <select
        id="order-sort"
        className="admin-order-filters__select"
        value={sortOption}
        onChange={(event) => onSortChange(event.target.value)}
      >
        {ORDER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default OrderFilters;
