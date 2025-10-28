const UserFormContact = ({ formState, onChange }) => (
  <>
    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-email">
        Correo electrónico
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
        La fecha de registro se asigna automáticamente y no puede modificarse.
      </small>
    </div>
  </>
);

export default UserFormContact;

