// src/components/registro/useRegistroForm.js
import { useMemo, useState } from "react";
import { formatRun, getComunasByRegion, norm, validate } from "./validators";
import { register as apiRegister } from "@/services/authService.js";
import { setAuth } from "@/components/auth/session";

export function useRegistroForm({ onSuccess } = {}) {
  const baseUsers = useMemo(() => [], []); // el backend valida duplicados
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    run: "",
    fechaNacimiento: "",
    region: "",
    comuna: "",
    direccion: "",
    telefonoCodigo: "+56",
    telefonoNumero: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [status, setStatus] = useState({ text: "", error: false });

  const comunas = useMemo(() => getComunasByRegion(form.region), [form.region]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onBlurRun = () => {
    const v = form.run.trim();
    const cleaned = norm.run(v);
    if (cleaned.length >= 2) setField("run", formatRun(cleaned));
  };

  const onChangeRegion = (value) => {
    setForm((f) => ({ ...f, region: value, comuna: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ text: "", error: false });

    const data = {
      ...form,
      run: norm.run(form.run),
      direccion: (form.direccion || "").replace(/\s+/g, " ").trim(),
      email: norm.email(form.email),
      username: form.username.trim(),
      telefono: `${form.telefonoCodigo}${(form.telefonoNumero || "").replace(/\D/g, "")}`,
    };

    const errors = validate(baseUsers, data);
    if (errors.length) {
      const first = errors[0];
      setStatus({ text: first.message, error: true });
      return;
    }

    try {
      const payload = await apiRegister({
        email: data.email,
        username: data.username,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
        rut: formatRun(data.run),
        direccion: data.direccion,
        region: data.region,
        comuna: data.comuna,
        fechaNacimiento: data.fechaNacimiento,
        telefono: data.telefono,
      });

      const { token, refreshToken, expiresAt, profile } = payload || {};
      if (token && profile) {
        setAuth({
          token,
          refreshToken,
          expiresAt: expiresAt ?? Date.now() + 60 * 60 * 1000,
          profile: { ...profile, role: (profile.role || "").toLowerCase() },
        });
      }

      setStatus({ text: "Registro completado. Te hemos iniciado sesi\u00f3n.", error: false });
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus({ text: err?.message || "No se pudo registrar. Intenta nuevamente.", error: true });
    }
  };

  return { form, setField, status, comunas, onBlurRun, onChangeRegion, onSubmit };
}
