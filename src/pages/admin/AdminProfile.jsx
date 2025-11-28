import { useEffect, useMemo, useRef, useState } from "react";
import useAuthSession from "@/hooks/useAuthSession.js";
import { fetchAdminUser, updateAdminUser } from "@/services/adminUserApi.js";
import { setAuth } from "@/components/auth/session";
import { REGIONES } from "@/data/regiones";
import {
  formatRun,
  getComunasByRegion,
  norm,
  calculateDv,
  validateEmail,
  validateRun,
} from "@/components/registro/validators";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

const generateToken = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const splitTelefono = (telefonoRaw) => {
  const fallbackCode = "+56";
  if (!telefonoRaw) return { telefonoCodigo: fallbackCode, telefonoNumero: "" };
  const digits = String(telefonoRaw).replace(/\s+/g, "");
  if (digits.startsWith("+")) {
    const code = digits.slice(0, 3).match(/^\+\d{1,4}/)?.[0] ?? fallbackCode;
    const number = digits.slice(code.length);
    return { telefonoCodigo: code, telefonoNumero: number };
  }
  return { telefonoCodigo: fallbackCode, telefonoNumero: digits };
};

const createInitialState = (user) => {
  const { telefonoCodigo, telefonoNumero } = splitTelefono(user?.telefono);
  return {
    id: user?.id ?? null,
    username: user?.username ?? "",
    password: "",
    passwordConfirm: "",
    role: (user?.role ?? "admin") || "admin",
    nombre: user?.nombre ?? "",
    apellido: user?.apellido ?? "",
    run: user?.run ?? "",
    fechaNacimiento: user?.fechaNacimiento ?? "",
    region: user?.region ?? "",
    comuna: user?.comuna ?? "",
    direccion: user?.direccion ?? "",
    email: user?.email ?? "",
    registeredAt: user?.registeredAt ?? new Date().toISOString(),
    avatarUrl: user?.avatarUrl ?? "",
    telefonoCodigo,
    telefonoNumero,
  };
};

const AdminProfile = () => {
  const { session, profile } = useAuthSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) {
      setUser(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchAdminUser(profile.id)
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const [formState, setFormState] = useState(() => createInitialState(user));
  const [errors, setErrors] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormState(createInitialState(user));
    setErrors([]);
    setStatusMessage("");
  }, [user]);

  const comunaOptions = useMemo(
    () => (formState.region ? getComunasByRegion(formState.region) : []),
    [formState.region],
  );

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
    setFormState((prev) => {
      const cleaned = norm.run(prev.run);
      if (!cleaned) {
        return { ...prev, run: "" };
      }

      if (cleaned.length < 2) {
        return { ...prev, run: cleaned };
      }

      const body = cleaned.slice(0, -1);
      const dv = calculateDv(body);
      return { ...prev, run: formatRun(`${body}${dv}`) };
    });
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors(["Selecciona una imagen válida para el avatar."]);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setErrors([`La imagen supera el límite de ${(MAX_AVATAR_SIZE / (1024 * 1024)).toFixed(1)} MB.`]);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setFormState((prev) => ({
        ...prev,
        avatarUrl: result,
      }));
      setErrors([]);
    };
    reader.onerror = () => {
      setErrors(["No se pudo leer el archivo seleccionado. Intenta con otra imagen."]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setFormState((prev) => ({
      ...prev,
      avatarUrl: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const validationErrors = [];
    const {
      username,
      password,
      passwordConfirm,
      nombre,
      apellido,
      run,
      fechaNacimiento,
      region,
      comuna,
      direccion,
      email,
      telefonoCodigo,
      telefonoNumero,
    } = formState;

    if (!username.trim()) validationErrors.push("El nombre de usuario es obligatorio.");
    if (!nombre.trim()) validationErrors.push("El nombre es obligatorio.");
    if (!apellido.trim()) validationErrors.push("El apellido es obligatorio.");
    if (!run.trim()) validationErrors.push("El RUN es obligatorio.");
    if (!fechaNacimiento.trim()) validationErrors.push("La fecha de nacimiento es obligatoria.");
    if (!region.trim()) validationErrors.push("Selecciona una región.");
    if (!comuna.trim()) validationErrors.push("Selecciona una comuna.");
    if (!direccion.trim()) validationErrors.push("La dirección es obligatoria.");
    if (!email.trim()) validationErrors.push("El correo electrónico es obligatorio.");

    if (password.trim() && !passwordConfirm.trim()) {
      validationErrors.push("Confirma tu nueva contraseña.");
    }
    if (password && passwordConfirm && password !== passwordConfirm) {
      validationErrors.push("Las contraseñas no coinciden.");
    }

    const runValidation = validateRun(norm.run(run));
    if (!runValidation.valid) validationErrors.push(runValidation.message);

    const emailValidation = validateEmail(norm.email(email));
    if (!emailValidation.valid) validationErrors.push(emailValidation.message);

    const telNum = String(telefonoNumero || "").replace(/\D/g, "");
    if (!telefonoCodigo) validationErrors.push("Selecciona el codigo de pais.");
    if (!telNum) validationErrors.push("El telefono es obligatorio.");
    else if (telNum.length < 7 || telNum.length > 12) validationErrors.push("Ingresa un telefono valido (7 a 12 digitos).");

    return validationErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    setErrors([]);
    setStatusMessage("");

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        username: formState.username.trim(),
        password: formState.password.trim() || undefined,
        role: user.role,
        nombre: formState.nombre.trim(),
        apellido: formState.apellido.trim(),
        run: formatRun(norm.run(formState.run)),
        fechaNacimiento: formState.fechaNacimiento.trim(),
        region: formState.region.trim(),
        comuna: formState.comuna.trim(),
        direccion: formState.direccion.replace(/\s+/g, " ").trim(),
        email: norm.email(formState.email),
        avatarUrl: formState.avatarUrl,
        telefono: `${formState.telefonoCodigo || "+56"}${(formState.telefonoNumero || "").replace(/\D/g, "")}`,
      };

      const updated = await updateAdminUser(user.id, payload);
      setFormState(createInitialState(updated));
      setErrors([]);
      setStatusMessage("Tu perfil se actualizó correctamente.");

      if (session) {
        setAuth({
          token: session.token,
          expiresAt: session.expiresAt,
          profile: {
            id: updated.id,
            username: updated.username,
            role: updated.role,
            nombre: updated.nombre,
            apellido: updated.apellido,
            email: updated.email,
            avatarUrl: updated.avatarUrl,
          },
        });
      } else if (profile) {
        setAuth({
          token: generateToken(),
          profile: {
            id: updated.id,
            username: updated.username,
            role: updated.role,
            nombre: updated.nombre,
            apellido: updated.apellido,
            email: updated.email,
            avatarUrl: updated.avatarUrl,
          },
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar el perfil.";
      setErrors([message]);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-paper admin-profile">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Cargando perfil...</h1>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="admin-paper admin-profile">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Perfil del administrador</h1>
          <p className="admin-page-subtitle">
            No encontramos la información del usuario activo. Inicia sesión nuevamente.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-paper admin-profile">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Perfil del administrador</h1>
        <p className="admin-page-subtitle">
          Actualiza tus datos personales, credenciales y foto de perfil. El identificador se mantiene fijo.
        </p>
      </div>

      {statusMessage && (
        <div className="admin-products__alert" role="status">
          {statusMessage}
        </div>
      )}

      <form className="admin-profile__layout" onSubmit={handleSubmit} noValidate>
        <aside className="admin-profile__aside">
          <div className="admin-profile__avatar">
            {formState.avatarUrl ? (
              <img src={formState.avatarUrl} alt="Avatar del administrador" />
            ) : (
              <span className="admin-profile__avatar-placeholder" aria-hidden="true">
                {formState.nombre?.[0]?.toUpperCase() ?? "A"}
              </span>
            )}
          </div>
          <label className="admin-profile__avatar-upload">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
            Cambiar foto
          </label>
          {formState.avatarUrl && (
            <button type="button" className="admin-profile__avatar-remove" onClick={handleRemoveAvatar}>
              Quitar foto
            </button>
          )}
          <p className="admin-profile__avatar-hint">
            La imagen se almacena en tu navegador. Admite JPG, PNG o GIF menores a 2MB.
          </p>
        </aside>

        <div className="admin-profile__form">
          <div className="admin-user-form__grid">
            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-id">
                ID
              </label>
              <input
                id="admin-id"
                type="text"
                className="admin-user-form__input"
                value={formState.id ?? ""}
                disabled
                readOnly
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-phone">
                Telefono
              </label>
              <div className="admin-user-form__phone">
                <select
                  id="admin-phone-code"
                  name="telefonoCodigo"
                  className="admin-user-form__input admin-user-form__input--phone-code"
                  value={formState.telefonoCodigo}
                  onChange={handleChange}
                >
                  <option value="+56">+56 (Chile)</option>
                  <option value="+1">+1 (USA)</option>
                  <option value="+34">+34 (Espa�a)</option>
                </select>
                <input
                  id="admin-phone-number"
                  name="telefonoNumero"
                  type="tel"
                  className="admin-user-form__input"
                  value={formState.telefonoNumero}
                  onChange={(e) => handleChange({ target: { name: "telefonoNumero", value: e.target.value.replace(/\D/g, "") } })}
                  placeholder="912345678"
                />
              </div>
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-username">
                Usuario
              </label>
              <input
                id="admin-username"
                name="username"
                type="text"
                className="admin-user-form__input"
                value={formState.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-email">
                Correo electrónico
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                className="admin-user-form__input"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-role">
                Rol
              </label>
              <input
                id="admin-role"
                type="text"
                className="admin-user-form__input"
                value={(formState.role || "admin").toUpperCase()}
                disabled
                readOnly
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-password">
                Nueva contraseña (opcional)
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                className="admin-user-form__input"
                value={formState.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-password-confirm">
                Confirmar contraseña
              </label>
              <input
                id="admin-password-confirm"
                name="passwordConfirm"
                type="password"
                className="admin-user-form__input"
                value={formState.passwordConfirm}
                onChange={handleChange}
                placeholder="Repite la contraseña"
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-nombre">
                Nombre
              </label>
              <input
                id="admin-nombre"
                name="nombre"
                type="text"
                className="admin-user-form__input"
                value={formState.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-apellido">
                Apellido
              </label>
              <input
                id="admin-apellido"
                name="apellido"
                type="text"
                className="admin-user-form__input"
                value={formState.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-run">
                RUN
              </label>
              <input
                id="admin-run"
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
              <label className="admin-user-form__label" htmlFor="admin-birthdate">
                Fecha de nacimiento
              </label>
              <input
                id="admin-birthdate"
                name="fechaNacimiento"
                type="date"
                className="admin-user-form__input"
                value={formState.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-region">
                Región
              </label>
              <select
                id="admin-region"
                name="region"
                className="admin-user-form__input"
                value={formState.region}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una región</option>
                {REGIONES.map((region) => (
                  <option key={region.region} value={region.region}>
                    {region.region}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-comuna">
                Comuna
              </label>
              <select
                id="admin-comuna"
                name="comuna"
                className="admin-user-form__input"
                value={formState.comuna}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una comuna</option>
                {comunaOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-user-form__group admin-user-form__group--full">
              <label className="admin-user-form__label" htmlFor="admin-address">
                Dirección
              </label>
              <input
                id="admin-address"
                name="direccion"
                type="text"
                className="admin-user-form__input"
                value={formState.direccion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-user-form__group">
              <label className="admin-user-form__label" htmlFor="admin-registered-at">
                Registrado el
              </label>
              <input
                id="admin-registered-at"
                name="registeredAt"
                type="datetime-local"
                className="admin-user-form__input"
                value={formState.registeredAt ? formState.registeredAt.slice(0, 16) : ""}
                readOnly
                disabled
              />
              <small className="text-muted d-block mt-1">
                La fecha de registro se establece automáticamente y no es editable.
              </small>
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
            <button
              type="submit"
              className="admin-user-form__button admin-user-form__button--primary"
              disabled={isSaving}
            >
              {isSaving ? "Guardando cambios..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AdminProfile;
