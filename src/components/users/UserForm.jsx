import { useCallback, useState } from "react";
import { formatRun, norm } from "@/components/registro/validators";
import useUserFormState from "@/hooks/useUserFormState.js";
import useUserValidation from "@/hooks/useUserValidation.js";
import UserFormCredentials from "@/components/users/UserFormCredentials.jsx";
import UserFormIdentity from "@/components/users/UserFormIdentity.jsx";
import UserFormLocation from "@/components/users/UserFormLocation.jsx";
import UserFormContact from "@/components/users/UserFormContact.jsx";

const ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "cliente", label: "Cliente" },
];

const UserForm = ({ initialUser, onSubmit, onCancel, submitLabel = "Guardar", isNew = false }) => {
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formState,
    handleChange,
    handleRunBlur,
    regionOptions,
    comunaOptions,
    shouldShowPasswordConfirm,
    userId,
  } = useUserFormState({ initialUser, isNew });

  const validateForm = useUserValidation({ formState, isNew });

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (typeof onSubmit !== "function") return;

      setIsSubmitting(true);
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      setErrors([]);

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
        direccion: (formState.direccion || "").replace(/\s+/g, " ").trim(),
        email: (formState.email || "").trim(),
        telefono: `${formState.telefonoCodigo || "+56"}${(formState.telefonoNumero || "").replace(/\D/g, "")}`,
        active: formState.active,
        registeredAt:
          initialUser?.registeredAt ?? formState.registeredAt ?? new Date().toISOString(),
      };
      if (!formState.telefonoNumero) delete payload.telefono;
      if (payload.active === undefined) delete payload.active;

      try {
        await onSubmit(payload);
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo guardar el usuario.";
        setErrors([message]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, initialUser, onSubmit, userId, validateForm],
  );

  return (
    <form className="admin-user-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-user-form__grid">
        <UserFormCredentials
          userId={userId}
          formState={formState}
          roleOptions={ROLE_OPTIONS}
          onChange={handleChange}
          shouldShowPasswordConfirm={shouldShowPasswordConfirm}
          isNew={isNew}
        />

        <UserFormIdentity
          formState={formState}
          onChange={handleChange}
          onRunBlur={handleRunBlur}
        />

        <UserFormLocation
          formState={formState}
          regionOptions={regionOptions}
          comunaOptions={comunaOptions}
          onChange={handleChange}
        />

        <UserFormContact formState={formState} onChange={handleChange} />
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





