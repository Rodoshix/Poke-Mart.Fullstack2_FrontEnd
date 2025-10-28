const UserFormIdentity = ({ formState, onChange, onRunBlur }) => (
  <>
    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-name">
        Nombre
      </label>
      <input
        id="user-name"
        name="nombre"
        type="text"
        className="admin-user-form__input"
        value={formState.nombre}
        onChange={onChange}
        required
      />
    </div>

    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-lastname">
        Apellido
      </label>
      <input
        id="user-lastname"
        name="apellido"
        type="text"
        className="admin-user-form__input"
        value={formState.apellido}
        onChange={onChange}
        required
      />
    </div>

    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-run">
        RUN
      </label>
      <input
        id="user-run"
        name="run"
        type="text"
        className="admin-user-form__input"
        value={formState.run}
        onChange={onChange}
        onBlur={onRunBlur}
        required
      />
    </div>

    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-birthdate">
        Fecha de nacimiento
      </label>
      <input
        id="user-birthdate"
        name="fechaNacimiento"
        type="date"
        className="admin-user-form__input"
        value={formState.fechaNacimiento}
        onChange={onChange}
        required
      />
    </div>
  </>
);

export default UserFormIdentity;

