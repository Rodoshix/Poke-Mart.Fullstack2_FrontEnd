import { useEffect, useMemo, useState } from "react";
import { REGIONES } from "@/data/regiones";
import {
  formatRun,
  getComunasByRegion,
  norm,
  validate as validateRegistration,
  validateEmail,
  validateRun,
} from "@/components/registro/validators";
import { getAllUsers } from "@/services/userService.js";

const ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "cliente", label: "Cliente" },
];

const UserForm = ({
  initialUser,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
  isNew = false,
}) => {
  const [formState, setFormState] = useState(() => ({
    username: initialUser?.username ?? "",
    password: "",
    passwordConfirm: "",
    role: initialUser?.role ?? "cliente",
    nombre: initialUser?.nombre ?? "",
    apellido: initialUser?.apellido ?? "",
    run: initialUser?.run ?? "",
    fechaNacimiento: initialUser?.fechaNacimiento ?? "",
    region: initialUser?.region ?? "",
    comuna: initialUser?.comuna ?? "",
    direccion: initialUser?.direccion ?? "",
    email: initialUser?.email ?? "",
    registeredAt: initialUser?.registeredAt ?? new Date().toISOString(),
  }));
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = useMemo(() => initialUser?.id ?? null, [initialUser]);

  useEffect(() => {
    setFormState({
      username: initialUser?.username ?? "",
      password: "",
      passwordConfirm: "",
      role: initialUser?.role ?? "cliente",
      nombre: initialUser?.nombre ?? "",
      apellido: initialUser?.apellido ?? "",
      run: initialUser?.run ?? "",
      fechaNacimiento: initialUser?.fechaNacimiento ?? "",
      region: initialUser?.region ?? "",
      comuna: initialUser?.comuna ?? "",
      direccion: initialUser?.direccion ?? "",
      email: initialUser?.email ?? "",
      registeredAt: initialUser?.registeredAt ?? new Date().toISOString(),
    });
    setErrors([]);
  }, [initialUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "region") {
      setFormState((prev) => ({
        ...prev,
        region: value,
        comuna: "",
      }));
      return;
    }
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRunBlur = () => {
    setFormState((prev) => ({
      ...prev,
      run: formatRun(norm.run(prev.run)),
    }));
  };

  const regionOptions = useMemo(
    () => [
      { value: "", label: "Selecciona una región" },
      ...REGIONES.map((region) => ({ value: region.region, label: region.region })),
    ],
    [],
  );

  const comunaOptions = useMemo(() => {
    if (!formState.region) return [];
    return getComunasByRegion(formState.region).map((comuna) => ({
      value: comuna,
      label: comuna,
    }));
  }, [formState.region]);

  const shouldShowPasswordConfirm = isNew || Boolean(formState.password);

  const validate = () => {
    const validationErrors = [];
    const {
      username,
      password,
      passwordConfirm,
      role,
      nombre,
      apellido,
      run,
      fechaNacimiento,
      region,
      comuna,
      direccion,
      email,
    } = formState;

    if (isNew) {
      const data = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        run: norm.run(run),
        fechaNacimiento,
        region,
        comuna,
        direccion: direccion.replace(/\s+/g, " ").trim(),
        username: username.trim(),
        email: norm.email(email),
        password: password,
        passwordConfirm: passwordConfirm,
      };
      const issues = validateRegistration(getAllUsers(), data);
      return issues.map((issue) => issue.message);
    }

    if (!username.trim()) validationErrors.push("El nombre de usuario es requerido.");
    if (!role.trim()) validationErrors.push("El rol es requerido.");
    if (!nombre.trim()) validationErrors.push("El nombre es requerido.");
    if (!apellido.trim()) validationErrors.push("El apellido es requerido.");
    if (!run.trim()) validationErrors.push("El RUN es requerido.");
    if (!fechaNacimiento.trim()) validationErrors.push("La fecha de nacimiento es requerida.");
    if (!region.trim()) validationErrors.push("La región es requerida.");
    if (!comuna.trim()) validationErrors.push("La comuna es requerida.");
    if (!direccion.trim()) validationErrors.push("La dirección es requerida.");
    if (!email.trim()) validationErrors.push("El correo electrónico es requerido.");

    if (password.trim() && !passwordConfirm.trim()) {
      validationErrors.push("Confirma la nueva contraseña.");
    }
    if (password && passwordConfirm && password !== passwordConfirm) {
      validationErrors.push("Las contraseñas no coinciden.");
    }

    const runValidation = validateRun(norm.run(run));
    if (!runValidation.valid) validationErrors.push(runValidation.message);

    const emailValidation = validateEmail(norm.email(email));
    if (!emailValidation.valid) validationErrors.push(emailValidation.message);

    return validationErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (typeof onSubmit !== "function") return;

    setIsSubmitting(true);
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      id: userId,
      username: formState.username.trim(),
      password: formState.password.trim() || initialUser?.password || "",
      role: formState.role.trim(),
      nombre: formState.nombre.trim(),
      apellido: formState.apellido.trim(),
      run: formatRun(norm.run(formState.run)),
      fechaNacimiento: formState.fechaNacimiento.trim(),
      region: formState.region.trim(),
      comuna: formState.comuna.trim(),
      direccion: formState.direccion.trim(),
      email: formState.email.trim(),
      registeredAt: formState.registeredAt,
    };

    try {
      await onSubmit(payload);
      setErrors([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar el usuario.";
      setErrors([message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-user-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-user-form__grid">
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
            onChange={handleChange}
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
            onChange={handleChange}
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
              onChange={handleChange}
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
            onChange={handleChange}
            required
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            onBlur={handleRunBlur}
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
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-user-form__group">
          <label className="admin-user-form__label" htmlFor="user-region">
            Región
          </label>
          <select
            id="user-region"
            name="region"
            className="admin-user-form__input"
            value={formState.region}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            required
          />
        </div>

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
            onChange={handleChange}
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
            onChange={(event) => {
              const value = event.target.value;
              setFormState((prev) => ({
                ...prev,
                registeredAt: value ? new Date(value).toISOString() : prev.registeredAt,
              }));
            }}
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="admin-user-form__errors" role="alert">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="admin-user-form__actions">
        {onCancel && (
          <button
            type="button"
            className="admin-user-form__button admin-user-form__button--secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="admin-user-form__button admin-user-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
