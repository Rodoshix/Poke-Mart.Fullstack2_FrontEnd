const UserFormContact = ({ formState, onChange }) => (
  <>
    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-email">
        Correo electronico
      </label>
      <input
        id="user-email"
        name="email"
        type="email"
        className="admin-user-form__input"
        value={formState.email}
        onChange={onChange}
        required
      />
    </div>

    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-phone">
        Telefono
      </label>
      <div className="admin-user-form__phone">
        <select
          id="user-phone-code"
          name="telefonoCodigo"
          className="admin-user-form__input admin-user-form__input--phone-code"
          value={formState.telefonoCodigo}
          onChange={onChange}
        >
          <option value="+56">+56 (Chile)</option>
          <option value="+1">+1 (USA)</option>
          <option value="+34">+34 (Espana)</option>
        </select>
        <input
          id="user-phone-number"
          name="telefonoNumero"
          type="tel"
          className="admin-user-form__input"
          value={formState.telefonoNumero}
          onChange={(e) =>
            onChange({ target: { name: "telefonoNumero", value: e.target.value.replace(/\D/g, "") } })
          }
          placeholder="912345678"
        />
      </div>
    </div>

    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-registered-at">
        Registrado el
      </label>
      <input
        id="user-registered-at"
        type="datetime-local"
        className="admin-user-form__input"
        value={formState.registeredAt ? formState.registeredAt.slice(0, 16) : ""}
        readOnly
        disabled
      />
      <small className="text-muted d-block mt-1">
        La fecha de registro se asigna automaticamente y no puede modificarse.
      </small>
    </div>
  </>
);

export default UserFormContact;
