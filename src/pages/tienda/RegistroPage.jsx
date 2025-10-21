// src/pages/tienda/RegistroPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "@/assets/styles/registro.css";
import usersJson from "@/data/users.json";

const REGIONS = [
  { region: "Kanto", comunas: ["Ciudad Central", "Ciudad Azafran", "Ciudad Celeste", "Pueblo Paleta"] },
  { region: "Johto", comunas: ["Ciudad Trigal", "Ciudad Iris", "Pueblo Primavera", "Ciudad Olivo"] },
  { region: "Hoenn", comunas: ["Ciudad Portual", "Ciudad Arborada", "Ciudad Calagua", "Pueblo Azuliza"] },
  { region: "Sinnoh", comunas: ["Ciudad Jubileo", "Ciudad Corazon", "Ciudad Pradera", "Pueblo Hojaverde"] },
];

// Misma política del registro original:
const EMAIL_DOMAINS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

const LOGO = "/src/assets/img/poke-mark-logo.png";

export default function RegistroPage() {
  // estilos de página (fondo gif + centrado)
  useEffect(() => {
    document.body.classList.add("page--registro");
    return () => document.body.classList.remove("page--registro");
  }, []);

  // base de usuarios (json + locales)
  const baseUsers = useMemo(() => {
    const fromFile = Array.isArray(usersJson?.users) ? usersJson.users : [];
    let locals = [];
    try {
      locals = JSON.parse(localStorage.getItem("pm_registeredUsers") || "[]");
      if (!Array.isArray(locals)) locals = [];
    } catch {
      locals = [];
    }
    // fusion simple por id -> el local puede repetir campos del json
    const map = new Map();
    [...fromFile, ...locals].forEach((u) => {
      if (!u || typeof u !== "object") return;
      map.set(Number(u.id) || u.username || u.email, u);
    });
    return Array.from(map.values());
  }, []);

  // form state
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    run: "",
    fechaNacimiento: "",
    region: "",
    comuna: "",
    direccion: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [status, setStatus] = useState({ text: "", error: false });

  // comunas disponibles según región
  const comunas = useMemo(() => {
    const entry = REGIONS.find((r) => r.region === form.region);
    return entry ? entry.comunas : [];
  }, [form.region]);

  // helpers RUN
  const calculateDv = (body) => {
    let sum = 0,
      mult = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += Number(body[i]) * mult;
      mult = mult === 7 ? 2 : mult + 1;
    }
    const mod = 11 - (sum % 11);
    if (mod === 11) return "0";
    if (mod === 10) return "K";
    return String(mod);
  };

  const validateRun = (run) => {
    const cleaned = String(run || "").replace(/[^0-9Kk]/g, "").toUpperCase();
    if (!cleaned) return { valid: false, message: "El RUN es obligatorio." };
    if (cleaned.length < 7 || cleaned.length > 9) {
      return { valid: false, message: "El RUN debe tener entre 7 y 9 caracteres." };
    }
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    if (!/^[0-9]+$/.test(body)) {
      return { valid: false, message: "El RUN debe contener solo números y K al final." };
    }
    const expected = calculateDv(body);
    if (expected !== dv) return { valid: false, message: "El RUN no es válido." };
    return { valid: true };
  };

  const formatRun = (raw) => {
    if (!raw) return "";
    const cleaned = String(raw).replace(/[^0-9Kk]/g, "").toUpperCase();
    if (cleaned.length < 2) return cleaned;
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${withDots}-${dv}`;
  };

  // email
  const validateEmail = (email) => {
    if (!email) return { valid: false, message: "El correo es obligatorio." };
    if (email.length > 100) return { valid: false, message: "El correo no puede superar 100 caracteres." };
    const [local, domain] = String(email).split("@");
    if (!local || !domain) return { valid: false, message: "El correo debe contener @." };
    if (!EMAIL_DOMAINS.includes(domain.toLowerCase())) {
      return {
        valid: false,
        message: "Solo se aceptan correos duoc.cl, profesor.duoc.cl, gmail.com.",
      };
    }
    return { valid: true };
  };

  // duplicados
  const norm = {
    username: (v) => String(v || "").trim().toLowerCase(),
    email: (v) => String(v || "").trim().toLowerCase(),
    run: (v) => String(v || "").replace(/[^0-9Kk]/g, "").toUpperCase(),
  };

  const findDuplicates = (values) => {
    const u = norm.username(values.username);
    const e = norm.email(values.email);
    const r = norm.run(values.run);

    const clashU = baseUsers.find((x) => norm.username(x.username) === u);
    if (clashU) return { field: "username", message: "Ya existe una cuenta con ese nombre de usuario." };

    const clashE = baseUsers.find((x) => norm.email(x.email) === e);
    if (clashE) return { field: "email", message: "Ya existe una cuenta registrada con ese correo." };

    const clashR = baseUsers.find((x) => norm.run(x.run) === r);
    if (clashR) return { field: "run", message: "Ya existe una cuenta registrada con ese RUN." };

    return null;
  };

  // validación
  const validate = (v) => {
    const issues = [];

    if (!v.nombre) issues.push({ field: "nombre", message: "El nombre es obligatorio." });
    else if (v.nombre.length > 50) issues.push({ field: "nombre", message: "El nombre no puede superar 50 caracteres." });

    if (!v.apellido) issues.push({ field: "apellido", message: "El apellido es obligatorio." });
    else if (v.apellido.length > 100) issues.push({ field: "apellido", message: "El apellido no puede superar 100 caracteres." });

    const runResult = validateRun(v.run);
    if (!runResult.valid) issues.push({ field: "run", message: runResult.message });

    if (!v.fechaNacimiento) issues.push({ field: "fechaNacimiento", message: "Debes indicar la fecha de nacimiento." });

    if (!v.region) issues.push({ field: "region", message: "Selecciona una región." });
    if (!v.comuna) issues.push({ field: "comuna", message: "Selecciona una ciudad/comuna." });

    if (!v.direccion) {
      issues.push({ field: "direccion", message: "La dirección es obligatoria." });
    } else {
      const normalizedDir = v.direccion.replace(/\s+/g, " ").trim();
      if (normalizedDir.length < 6) issues.push({ field: "direccion", message: "La dirección debe tener al menos 6 caracteres." });
      else if (normalizedDir.length > 300) issues.push({ field: "direccion", message: "La dirección no puede superar 300 caracteres." });
    }

    if (!v.username) issues.push({ field: "username", message: "El nombre de usuario es obligatorio." });

    const emailResult = validateEmail(v.email);
    if (!emailResult.valid) issues.push({ field: "email", message: emailResult.message });

    if (!v.password) issues.push({ field: "password", message: "Debes definir una contraseña." });
    if (!v.passwordConfirm) issues.push({ field: "passwordConfirm", message: "Confirma tu contraseña." });
    if (v.password && v.passwordConfirm && v.password !== v.passwordConfirm) {
      issues.push({ field: "passwordConfirm", message: "Las contraseñas no coinciden." });
    }

    const dup = findDuplicates(v);
    if (dup) issues.push(dup);

    return issues;
  };

  // next id
  const getNextId = () => {
    const all = baseUsers;
    const maxId = all.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0);
    return (maxId || 0) + 1;
  };

  // handlers
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onBlurRun = () => {
    const v = form.run.trim();
    const cleaned = v.replace(/[^0-9Kk]/g, "").toUpperCase();
    if (cleaned.length >= 2) setField("run", formatRun(cleaned));
  };

  const onChangeRegion = (value) => {
    // si cambias región, resetea comuna si ya no pertenece
    setForm((f) => ({
      ...f,
      region: value,
      comuna: "",
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus({ text: "", error: false });

    const data = {
      ...form,
      run: form.run.toUpperCase(),
      direccion: form.direccion.replace(/\s+/g, " ").trim(),
      email: form.email.trim().toLowerCase(),
      username: form.username.trim(),
    };

    const errors = validate(data);
    if (errors.length) {
      const first = errors[0];
      setStatus({ text: first.message, error: true });
      return;
    }

    const newUser = {
      id: getNextId(),
      username: data.username,
      password: data.password,
      role: "cliente",
      nombre: data.nombre,
      apellido: data.apellido,
      run: formatRun(data.run),
      fechaNacimiento: data.fechaNacimiento,
      region: data.region,
      comuna: data.comuna,
      direccion: data.direccion,
      email: data.email,
    };

    // guarda en localStorage
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem("pm_registeredUsers") || "[]");
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }
    list.push(newUser);
    localStorage.setItem("pm_registeredUsers", JSON.stringify(list));

    setStatus({ text: "¡Registro completado! Ya puedes iniciar sesión.", error: false });
    // reset
    setForm({
      nombre: "",
      apellido: "",
      run: "",
      fechaNacimiento: "",
      region: "",
      comuna: "",
      direccion: "",
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });
  };

  return (
    <main className="registro" role="main">
      <section className="registro__wrapper" aria-labelledby="registroTitle">
        <header className="registro__header">
          <div className="registro__brand">
            <img className="registro__logo" src={LOGO} alt="Logo Poke Mart" width="48" height="48" aria-hidden="true" />
            <span className="registro__empresa">Poke Mart</span>
          </div>
          <h1 id="registroTitle" className="registro__title">Crear cuenta</h1>
        </header>

        <form className="registro__form" onSubmit={onSubmit} noValidate>
          <div className="registro__row">
            <label className="registro__field">
              <span className="registro__label">Nombre</span>
              <input
                className="registro__input"
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setField("nombre", e.target.value)}
                required
              />
            </label>
            <label className="registro__field">
              <span className="registro__label">Apellido</span>
              <input
                className="registro__input"
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={(e) => setField("apellido", e.target.value)}
                required
              />
            </label>
          </div>

          <div className="registro__row">
            <label className="registro__field">
              <span className="registro__label">RUN</span>
              <input
                className="registro__input"
                type="text"
                name="run"
                placeholder="98765432K"
                value={form.run}
                onChange={(e) => setField("run", e.target.value)}
                onBlur={onBlurRun}
                required
              />
            </label>
            <label className="registro__field">
              <span className="registro__label">Fecha de nacimiento</span>
              <input
                className="registro__input"
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={(e) => setField("fechaNacimiento", e.target.value)}
                required
              />
            </label>
          </div>

          <div className="registro__row">
            <label className="registro__field">
              <span className="registro__label">Región</span>
              <select
                className="registro__input registro__input--select"
                name="region"
                value={form.region}
                onChange={(e) => onChangeRegion(e.target.value)}
                required
              >
                <option value="">Selecciona una region</option>
                {REGIONS.map((r) => (
                  <option key={r.region} value={r.region}>
                    {r.region}
                  </option>
                ))}
              </select>
            </label>
            <label className="registro__field">
              <span className="registro__label">Ciudad / Comuna</span>
              <select
                className="registro__input registro__input--select"
                name="comuna"
                value={form.comuna}
                onChange={(e) => setField("comuna", e.target.value)}
                required
              >
                <option value="">Selecciona una ciudad</option>
                {comunas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="registro__field">
            <span className="registro__label">Dirección</span>
            <input
              className="registro__input"
              type="text"
              name="direccion"
              placeholder="Oficina Central Poke Mart"
              value={form.direccion}
              onChange={(e) => setField("direccion", e.target.value)}
              required
            />
          </label>

          <p className={`registro__status ${status.error ? "registro__status--error" : ""}`} role="status" aria-live="polite">
            {status.text}
          </p>

          <div className="registro__row">
            <label className="registro__field">
              <span className="registro__label">Nombre de usuario</span>
              <input
                className="registro__input"
                type="text"
                name="username"
                placeholder="Usuario"
                value={form.username}
                onChange={(e) => setField("username", e.target.value)}
                required
              />
            </label>
            <label className="registro__field">
              <span className="registro__label">Correo electrónico</span>
              <input
                className="registro__input"
                type="email"
                name="email"
                placeholder="usuario@duoc.cl"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                required
              />
            </label>
          </div>

          <div className="registro__row">
            <label className="registro__field">
              <span className="registro__label">Contraseña</span>
              <input
                className="registro__input"
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                required
              />
            </label>
            <label className="registro__field">
              <span className="registro__label">Confirmar contraseña</span>
              <input
                className="registro__input"
                type="password"
                name="passwordConfirm"
                placeholder="Confirma contraseña"
                value={form.passwordConfirm}
                onChange={(e) => setField("passwordConfirm", e.target.value)}
                required
              />
            </label>
          </div>

          <button type="submit" className="registro__btn btn btn-primary">Registrar</button>
        </form>

        <footer className="registro__footer">
          <p className="registro__hint">
            ¿Ya tienes cuenta? <Link className="registro__link" to="/login">Inicia sesión</Link>
          </p>
        </footer>
      </section>
    </main>
  );
}
