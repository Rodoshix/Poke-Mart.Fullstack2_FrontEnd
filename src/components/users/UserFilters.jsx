const UserFilters = ({
  roles = [],
  regions = [],
  sortOptions = [],
  selectedRole,
  selectedRegion,
  sortOption,
  searchTerm,
  onRoleChange,
  onRegionChange,
  onSortChange,
  onSearchChange,
  onReset,
}) => (
  <div className="admin-users__filters">
    <div className="admin-users__filter admin-users__filter--search">
      <label htmlFor="user-search" className="admin-users__label">
        Buscar
      </label>
      <input
        id="user-search"
        type="search"
        className="admin-users__input"
        placeholder="Nombre, correo o usuario"
        value={searchTerm}
        onChange={(event) => onSearchChange?.(event.target.value)}
      />
    </div>

    <div className="admin-users__filter">
      <label htmlFor="user-role" className="admin-users__label">
        Rol
      </label>
      <select
        id="user-role"
        className="admin-users__select"
        value={selectedRole}
        onChange={(event) => onRoleChange?.(event.target.value)}
      >
        <option value="">Todos</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>

    <div className="admin-users__filter">
      <label htmlFor="user-region" className="admin-users__label">
        Región
      </label>
      <select
        id="user-region"
        className="admin-users__select"
        value={selectedRegion}
        onChange={(event) => onRegionChange?.(event.target.value)}
      >
        <option value="">Todas</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>

    <div className="admin-users__filter">
      <label htmlFor="user-sort" className="admin-users__label">
        Ordenar
      </label>
      <select
        id="user-sort"
        className="admin-users__select"
        value={sortOption}
        onChange={(event) => onSortChange?.(event.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    {onReset && (
      <div className="admin-users__filter admin-users__filter--actions">
        <button type="button" className="admin-users__reset" onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    )}
  </div>
);

export default UserFilters;
