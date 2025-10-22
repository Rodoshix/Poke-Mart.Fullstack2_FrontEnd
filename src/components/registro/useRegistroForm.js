// src/components/registro/useRegistroForm.js
import { useMemo, useState } from "react";
import { getBaseUsers, getNextId, saveUser } from "./usersRepo";
import { formatRun, getComunasByRegion, norm, validate } from "./validators";

export function useRegistroForm() {
  const baseUsers = useMemo(() => getBaseUsers(), []);
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

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus({ text: "", error: false });

    const data = {
      ...form,
      run: norm.run(form.run),
      direccion: form.direccion.replace(/\s+/g, " ").trim(),
      email: norm.email(form.email),
      username: form.username.trim(),
    };

    const errors = validate(baseUsers, data);
    if (errors.length) {
      const first = errors[0];
      setStatus({ text: first.message, error: true });
      return;
    }

    const newUser = {
      id: getNextId(baseUsers),
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

    saveUser(newUser);

    setStatus({ text: "¡Registro completado! Ya puedes iniciar sesión.", error: false });
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

  return { form, setField, status, comunas, onBlurRun, onChangeRegion, onSubmit };
}
