import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import "@/assets/styles/registro.css";
import "@/assets/styles/perfil.css";

import Field from "@/components/registro/Field";
import StatusMessage from "@/components/registro/StatusMessage";
import { REGIONES } from "@/data/regiones";
import { formatRun, getComunasByRegion, norm, validateEmail, validateRun } from "@/components/registro/validators";
import useAuthSession from "@/hooks/useAuthSession";
import { fetchProfile, updateProfile } from "@/services/profileApi";
import { setAuth } from "@/components/auth/session";
import PageBorders from "@/components/layout/PageBorders";

const DEFAULT_CODE = "+56";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

const parseTelefono = (telefono) => {
  const raw = String(telefono || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return { codigo: DEFAULT_CODE, numero: "" };

  const isChilean = digits.startsWith("56");
  if (raw.startsWith("+") && digits.length > 4) {
    const code = isChilean ? "+56" : `+${digits.slice(0, 3)}`;
    const number = digits.slice(isChilean ? 2 : 3);
    return { codigo: code, numero: number };
  }

  if (digits.length > 9) {
    const code = isChilean ? "+56" : `+${digits.slice(0, 3)}`;
    const number = digits.slice(isChilean ? 2 : 3);
    return { codigo: code, numero: number };
  }

  return { codigo: isChilean ? "+56" : DEFAULT_CODE, numero: digits };
};

const createInitialForm = (profile) => {
  const phone = parseTelefono(profile?.telefono);
  return {
    nombre: profile?.nombre ?? "",
    apellido: profile?.apellido ?? "",
    run: formatRun(profile?.rut ?? profile?.run ?? ""),
    fechaNacimiento: profile?.fechaNacimiento ?? "",
    region: profile?.region ?? "",
    comuna: profile?.comuna ?? "",
    direccion: profile?.direccion ?? "",
    telefonoCodigo: phone.codigo,
    telefonoNumero: phone.numero,
    username: profile?.username ?? "",
    email: profile?.email ?? "",
    password: "",
    passwordConfirm: "",
    avatarUrl: profile?.avatarUrl ?? "",
  };
};

const normalizeTelefono = (codigo, numero) => {
  const cleanCode = String(codigo || "").replace(/[^\d+]/g, "") || DEFAULT_CODE;
  const cleanNumber = String(numero || "").replace(/\D/g, "");
  return `${cleanCode.startsWith("+") ? cleanCode : `+${cleanCode}`}${cleanNumber}`;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { session, profile: sessionProfile } = useAuthSession();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(() => createInitialForm(sessionProfile));
  const [status, setStatus] = useState({ text: "", error: false });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const comunaOptions = useMemo(() => getComunasByRegion(form.region), [form.region]);

  useEffect(() => {
    document.body.classList.add("page--perfil");
    return () => document.body.classList.remove("page--perfil");
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setStatus({ text: "", error: false });
      try {
        const data = await fetchProfile();
        if (!cancelled && data) {
          setForm(createInitialForm(data));
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({ text: error?.message || "No se pudo cargar tu perfil.", error: true });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => { cancelled = true; };
  }, [session]);

  if (!session) {
    return <Navigate to="/login" replace state={{ redirect: "/perfil" }} />;
  }

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegionChange = (value) => {
    setForm((prev) => ({ ...prev, region: value, comuna: "" }));
  };

  const handleRunBlur = () => {
    const cleaned = norm.run(form.run);
    if (!cleaned) return;
    if (cleaned.length < 2) {
      setForm((prev) => ({ ...prev, run: cleaned }));
      return;
    }
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    const formatted = formatRun(`${body}${dv}`);
    setForm((prev) => ({ ...prev, run: formatted }));
  };

  const validateForm = () => {
    const issues = [];
    if (!form.nombre.trim()) issues.push("El nombre es obligatorio.");
    if (!form.apellido.trim()) issues.push("El apellido es obligatorio.");
    if (!form.run.trim()) issues.push("El RUN es obligatorio.");
    if (!form.fechaNacimiento.trim()) issues.push("La fecha de nacimiento es obligatoria.");
    if (!form.region.trim()) issues.push("Selecciona una región.");
    if (!form.comuna.trim()) issues.push("Selecciona una comuna.");
    if (!form.direccion.trim()) issues.push("La dirección es obligatoria.");
    if (!form.username.trim()) issues.push("El nombre de usuario es obligatorio.");
    if (!form.email.trim()) issues.push("El correo electrónico es obligatorio.");

    const runValidation = validateRun(norm.run(form.run));
    if (!runValidation.valid) issues.push(runValidation.message);

    const emailValidation = validateEmail(norm.email(form.email));
    if (!emailValidation.valid) issues.push(emailValidation.message);

    const password = form.password.trim();
    const confirm = form.passwordConfirm.trim();
    if (password && password.length < 6) issues.push("La contraseña debe tener al menos 6 caracteres.");
    if (password || confirm) {
      if (!confirm) issues.push("Confirma tu nueva contraseña.");
      if (password && confirm && password !== confirm) issues.push("Las contraseñas no coinciden.");
    }

    const telefonoNumero = form.telefonoNumero.replace(/\D/g, "");
    if (!telefonoNumero || telefonoNumero.length < 7) {
      issues.push("Ingresa un teléfono válido.");
    }
    return issues;
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus({ text: "Selecciona una imagen válida para el avatar.", error: true });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setStatus({
        text: `La imagen supera el límite de ${(MAX_AVATAR_SIZE / (1024 * 1024)).toFixed(1)} MB.`,
        error: true,
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((prev) => ({
        ...prev,
        avatarUrl: result,
      }));
      setStatus({ text: "", error: false });
    };
    reader.onerror = () => {
      setStatus({ text: "No se pudo leer la imagen seleccionada.", error: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setForm((prev) => ({
      ...prev,
      avatarUrl: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ text: "", error: false });

    const errors = validateForm();
    if (errors.length) {
      setStatus({ text: errors[0], error: true });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        rut: formatRun(norm.run(form.run)),
        fechaNacimiento: form.fechaNacimiento.trim(),
        region: form.region.trim(),
        comuna: form.comuna.trim(),
        direccion: form.direccion.replace(/\s+/g, " ").trim(),
        telefono: normalizeTelefono(form.telefonoCodigo, form.telefonoNumero),
        username: form.username.trim(),
        email: norm.email(form.email),
        password: form.password.trim() || undefined,
        avatarUrl: form.avatarUrl.trim() || undefined,
      };

      const updated = await updateProfile(payload);
      if (updated) {
        setForm(createInitialForm(updated));
        if (fileInputRef.current) fileInputRef.current.value = "";
        const normalizedProfile = { ...updated, role: (updated.role || "").toLowerCase() };
        if (session?.token) {
          setAuth({
            token: session.token,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt,
            profile: normalizedProfile,
          });
        }
      }
      setStatus({ text: "Perfil actualizado correctamente.", error: false });
    } catch (error) {
      setStatus({ text: error?.message || "No se pudo actualizar el perfil.", error: true });
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = (form.nombre || form.username || "U").charAt(0).toUpperCase();

  return (
    <main className="perfil" role="main">
      <PageBorders />
      <section className="perfil__wrapper" aria-labelledby="perfilTitle">
        <header className="perfil__header">
          <div>
            <p className="perfil__eyebrow">Perfil de cliente</p>
            <h1 id="perfilTitle" className="perfil__title">Tus datos</h1>
            <p className="perfil__subtitle">
              Mantén tu información al día para agilizar tus compras y mantener tu cuenta segura.
            </p>
          </div>
        </header>

        <StatusMessage text={status.text} error={status.error} />

        {loading ? (
          <div className="perfil__loading" role="status">Cargando perfil...</div>
        ) : (
          <form className="perfil__form" onSubmit={handleSubmit} noValidate>
            <div className="perfil__layout">
              <aside className="perfil__aside">
                <div className="perfil__avatar" aria-hidden="true">
                  {form.avatarUrl ? (
                    <img src={form.avatarUrl} alt="Avatar del usuario" />
                  ) : (
                    <span className="perfil__avatar-fallback">{avatarLetter}</span>
                  )}
                </div>
                <div className="perfil__meta">
                  <p className="perfil__name">{form.nombre || sessionProfile?.nombre || "Entrenador"}</p>
                  <p className="perfil__username">@{form.username || sessionProfile?.username}</p>
                  <p className="perfil__email">{form.email || sessionProfile?.email}</p>
                </div>
                <div className="perfil__avatar-actions">
                  <label className="perfil__upload-btn">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                    Cambiar foto
                  </label>
                  {form.avatarUrl && (
                    <button
                      type="button"
                      className="perfil__clear-avatar"
                      onClick={handleRemoveAvatar}
                    >
                      Quitar foto
                    </button>
                  )}
                  <p className="perfil__avatar-hint">
                    La imagen se guarda en tu navegador. Usa JPG, PNG o GIF menores a 2MB.
                  </p>
                </div>
              </aside>

              <div className="perfil__fields">
                <div className="perfil__section">
                  <p className="perfil__section-title">Datos personales</p>
                  <div className="registro__row">
                    <Field
                      label="Nombre"
                      name="nombre"
                      value={form.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      placeholder="Nombre"
                      required
                    />
                    <Field
                      label="Apellido"
                      name="apellido"
                      value={form.apellido}
                      onChange={(e) => handleChange("apellido", e.target.value)}
                      placeholder="Apellido"
                      required
                    />
                  </div>

                  <div className="registro__row">
                    <Field
                      label="RUN"
                      name="run"
                      value={form.run}
                      onChange={(e) => handleChange("run", e.target.value)}
                      onBlur={handleRunBlur}
                      placeholder="12.345.678-9"
                      required
                      disabled
                    />
                    <Field
                      label="Fecha de nacimiento"
                      name="fechaNacimiento"
                      type="date"
                      value={form.fechaNacimiento}
                      onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                      required
                    />
                  </div>

                  <div className="registro__row">
                    <Field
                      label="Región"
                      name="region"
                      as="select"
                      value={form.region}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      required
                      options={[{ value: "", label: "Selecciona una región" }, ...REGIONES.map(r => ({ value: r.region, label: r.region }))]}
                    />
                    <Field
                      label="Ciudad / Comuna"
                      name="comuna"
                      as="select"
                      value={form.comuna}
                      onChange={(e) => handleChange("comuna", e.target.value)}
                      required
                      options={[{ value: "", label: "Selecciona una comuna" }, ...comunaOptions]}
                    />
                  </div>

                  <Field
                    label="Dirección"
                    name="direccion"
                    value={form.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    placeholder="Calle, número y detalles"
                    required
                  />

                  <div className="registro__row registro__row--telefono">
                    <Field
                      label="Código"
                      name="telefonoCodigo"
                      as="select"
                      className="registro__field--codigo"
                      value={form.telefonoCodigo}
                      onChange={(e) => handleChange("telefonoCodigo", e.target.value)}
                      options={[{ value: "+56", label: "+56 (Chile)" }, { value: "+1", label: "+1" }, { value: "+34", label: "+34" }]}
                      required
                    />
                    <Field
                      label="Teléfono"
                      name="telefonoNumero"
                      type="tel"
                      value={form.telefonoNumero}
                      onChange={(e) => handleChange("telefonoNumero", e.target.value.replace(/\D/g, ""))}
                      placeholder="912345678"
                      required
                    />
                  </div>
                </div>

                <div className="perfil__section">
                  <p className="perfil__section-title">Acceso y contacto</p>
                  <div className="registro__row">
                    <Field
                      label="Nombre de usuario"
                      name="username"
                      value={form.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      placeholder="Usuario"
                      required
                      disabled
                    />
                    <Field
                      label="Correo electrónico"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="usuario@duoc.cl"
                      required
                    />
                  </div>

                  <div className="registro__row">
                    <Field
                      label="Nueva contraseña (opcional)"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="••••••••"
                    />
                    <Field
                      label="Confirmar contraseña"
                      name="passwordConfirm"
                      type="password"
                      value={form.passwordConfirm}
                      onChange={(e) => handleChange("passwordConfirm", e.target.value)}
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="perfil__actions">
              <button type="button" className="perfil__action perfil__action--ghost" onClick={() => navigate(-1)}>
                Volver
              </button>
              <button type="submit" className="perfil__action perfil__action--primary" disabled={saving}>
                {saving ? "Guardando cambios..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
