const UserFormLocation = ({ formState, regionOptions, comunaOptions, onChange }) => (
  <>
    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-region">
        Región
      </label>
      <select
        id="user-region"
        name="region"
        className="admin-user-form__input"
        value={formState.region}
        onChange={onChange}
        required
      >
        {regionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-comuna">
        Comuna
      </label>
      <select
        id="user-comuna"
        name="comuna"
        className="admin-user-form__input"
        value={formState.comuna}
        onChange={onChange}
        required
      >
        <option value="">Selecciona una comuna</option>
        {comunaOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    <div className="admin-user-form__group admin-user-form__group--full">
      <label className="admin-user-form__label" htmlFor="user-address">
        Dirección
      </label>
      <input
        id="user-address"
        name="direccion"
        type="text"
        className="admin-user-form__input"
        value={formState.direccion}
        onChange={onChange}
        required
      />
    </div>
  </>
);

export default UserFormLocation;

