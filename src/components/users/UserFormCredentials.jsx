const UserFormCredentials = ({ userId, formState, roleOptions, onChange, shouldShowPasswordConfirm, isNew }) => (
  <>
    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-id">
        ID
      </label>
      <input
        id="user-id"
        type="text"
        className="admin-user-form__input"
        value={userId ?? "Se asignará automáticamente"}
        disabled
        readOnly
      />
    </div>

    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-username">
        Usuario
      </label>
      <input
        id="user-username"
        name="username"
        type="text"
        className="admin-user-form__input"
        value={formState.username}
        onChange={onChange}
        required
      />
    </div>

    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-password">
        Contraseña {isNew ? "" : "(deja vacío para conservar)"}
      </label>
      <input
        id="user-password"
        name="password"
        type="password"
        className="admin-user-form__input"
        value={formState.password}
        onChange={onChange}
        placeholder={isNew ? "Ingresa una contraseña" : "••••••••"}
      />
    </div>

    {shouldShowPasswordConfirm && (
      <div className="admin-user-form__group">
        <label className="admin-user-form__label" htmlFor="user-password-confirm">
          Confirmar contraseña
        </label>
        <input
          id="user-password-confirm"
          name="passwordConfirm"
          type="password"
          className="admin-user-form__input"
          value={formState.passwordConfirm}
          onChange={onChange}
          placeholder="Repite la contraseña"
        />
      </div>
    )}

    <div className="admin-user-form__group">
      <label className="admin-user-form__label" htmlFor="user-role">
        Rol
      </label>
      <select
        id="user-role"
        name="role"
        className="admin-user-form__input"
        value={formState.role}
        onChange={onChange}
        required
      >
        {roleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </>
);

export default UserFormCredentials;

