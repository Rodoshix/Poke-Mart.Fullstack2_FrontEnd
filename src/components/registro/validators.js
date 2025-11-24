// src/components/registro/validators.js
import { EMAIL_DOMAINS } from "./constants";
import { REGIONES } from "@/data/regiones";

export const norm = {
  username: (v) => String(v || "").trim().toLowerCase(),
  email: (v) => String(v || "").trim().toLowerCase(),
  run: (v) => String(v || "").replace(/[^0-9Kk]/g, "").toUpperCase(),
};

export function calculateDv(body) {
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
}

export function validateRun(run) {
  const cleaned = String(run || "").replace(/[^0-9Kk]/g, "").toUpperCase();
  if (!cleaned) return { valid: false, message: "El RUN es obligatorio." };
  if (cleaned.length < 7 || cleaned.length > 9) {
    return { valid: false, message: "El RUN debe tener entre 7 y 9 caracteres." };
  }
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  if (!/^[0-9]+$/.test(body)) {
    return { valid: false, message: "El RUN debe contener solo numeros y K al final." };
  }
  const expected = calculateDv(body);
  if (expected !== dv) return { valid: false, message: "El RUN no es valido." };
  return { valid: true };
}

export function formatRun(raw) {
  if (!raw) return "";
  const cleaned = String(raw).replace(/[^0-9Kk]/g, "").toUpperCase();
  if (cleaned.length < 2) return cleaned;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withDots}-${dv}`;
}

export function validateEmail(email) {
  if (!email) return { valid: false, message: "El correo es obligatorio." };
  if (email.length > 100) return { valid: false, message: "El correo no puede superar 100 caracteres." };
  const [local, domain] = String(email).split("@");
  if (!local || !domain) return { valid: false, message: "El correo debe contener @." };
  if (!EMAIL_DOMAINS.includes(domain.toLowerCase())) {
    return { valid: false, message: "Solo se aceptan correos duoc.cl, profesor.duoc.cl, gmail.com." };
  }
  return { valid: true };
}

export function findDuplicates(baseUsers, values) {
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
}

export function validate(baseUsers, v) {
  const issues = [];

  if (!v.nombre) issues.push({ field: "nombre", message: "El nombre es obligatorio." });
  else if (v.nombre.length > 50) issues.push({ field: "nombre", message: "El nombre no puede superar 50 caracteres." });

  if (!v.apellido) issues.push({ field: "apellido", message: "El apellido es obligatorio." });
  else if (v.apellido.length > 100) issues.push({ field: "apellido", message: "El apellido no puede superar 100 caracteres." });

  const runResult = validateRun(v.run);
  if (!runResult.valid) issues.push({ field: "run", message: runResult.message });

  if (!v.fechaNacimiento) issues.push({ field: "fechaNacimiento", message: "Debes indicar la fecha de nacimiento." });

  if (!v.region) issues.push({ field: "region", message: "Selecciona una region." });
  if (!v.comuna) issues.push({ field: "comuna", message: "Selecciona una ciudad/comuna." });

  if (!v.direccion) {
    issues.push({ field: "direccion", message: "La direccion es obligatoria." });
  } else {
    const normalizedDir = v.direccion.replace(/\s+/g, " ").trim();
    if (normalizedDir.length < 6) issues.push({ field: "direccion", message: "La direccion debe tener al menos 6 caracteres." });
    else if (normalizedDir.length > 300) issues.push({ field: "direccion", message: "La direccion no puede superar 300 caracteres." });
  }

  const telefonoCodigo = String(v.telefonoCodigo || "").trim();
  const telefonoNumero = String(v.telefonoNumero || "").trim();
  if (!telefonoCodigo) {
    issues.push({ field: "telefonoCodigo", message: "Selecciona el codigo de pais." });
  } else if (!/^\+\d{1,4}$/.test(telefonoCodigo)) {
    issues.push({ field: "telefonoCodigo", message: "Codigo de pais invalido." });
  }

  if (!telefonoNumero) {
    issues.push({ field: "telefonoNumero", message: "El telefono es obligatorio." });
  } else if (!/^\d{7,12}$/.test(telefonoNumero)) {
    issues.push({ field: "telefonoNumero", message: "El telefono debe contener solo numeros (7 a 12 digitos)." });
  }

  if (!v.telefono) {
    issues.push({ field: "telefono", message: "El telefono es obligatorio." });
  }

  if (!v.username) issues.push({ field: "username", message: "El nombre de usuario es obligatorio." });

  const emailResult = validateEmail(v.email);
  if (!emailResult.valid) issues.push({ field: "email", message: emailResult.message });

  if (!v.password) issues.push({ field: "password", message: "Debes definir una contrasena." });
  if (!v.passwordConfirm) issues.push({ field: "passwordConfirm", message: "Confirma tu contrasena." });
  if (v.password && v.passwordConfirm && v.password !== v.passwordConfirm) {
    issues.push({ field: "passwordConfirm", message: "Las contrasenas no coinciden." });
  }

  const dup = findDuplicates(baseUsers, v);
  if (dup) issues.push(dup);

  return issues;
}

export function getComunasByRegion(region) {
  const entry = REGIONES.find((r) => r.region === region);
  return entry ? entry.comunas : [];
}
