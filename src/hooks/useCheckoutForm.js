// usado por el CheckoutPage.jsx
// src/hooks/useCheckoutForm.js
import { useEffect, useState } from "react";
import usersData from "@/data/users.json";
import { getAuth, getProfile } from "@/components/auth/session";
import { REGIONES } from "@/data/regiones";

const first = (...vals) => vals.find((v) => v !== undefined && v !== null && String(v).trim() !== "") ?? "";

function extractUsers(data) {
  if (!data) return [];
  if (Array.isArray(data.users)) return data.users;
  if (Array.isArray(data) && data.length && Array.isArray(data[0]?.users)) return data[0].users;
  return [];
}

export function useCheckoutForm() {
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "",
    calle: "", departamento: "", region: "", comuna: "", notas: "",
  });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Prefill desde sesión + users.json
  useEffect(() => {
    const auth = getAuth();
    const profile = getProfile();
    if (!auth || !profile) return;

    let base = profile;
    try {
      const list = extractUsers(usersData);
      const keyUser = String(profile.username || "").toLowerCase();
      const keyMail = String(profile.email || profile.correo || "").toLowerCase();

      let extra =
        list.find(
          (u) =>
            (u.username && String(u.username).toLowerCase() === keyUser && keyUser) ||
            (u.email && String(u.email).toLowerCase() === keyMail && keyMail)
        ) || null;

      if (!extra && profile.nombre && profile.apellido) {
        extra = list.find(
          (u) =>
            String(u.nombre || "").toLowerCase() === String(profile.nombre).toLowerCase() &&
            String(u.apellido || "").toLowerCase() === String(profile.apellido).toLowerCase()
        ) || null;
      }

      if (extra) base = { ...extra, ...base };
    } catch { /* ignore */ }

    const envio =
      base.envio || base.shipping || base.direccionEnvio || base.direcciónEnvio ||
      base.delivery || (base.address && (base.address.shipping || base.address.envio)) ||
      base.address || {};

    const nombre  = first(base.nombre, base.nombres, base.firstName, base.name);
    const apellido= first(base.apellido, base.apellidos, base.lastName, base.surname);
    const email   = first(base.email, base.correo, base.mail);

    const calle = first(base.calle, base.direccion, base.dirección, envio.calle, envio.direccion, envio.dirección, envio.line1, envio.dir1);
    const departamento = first(base.departamento, base.depto, envio.departamento, envio.depto, envio.line2, envio.apto, envio.apartment);
    const region = first(base.region, envio.region, base.regionOrigen, base.region_origen, envio.state, envio.provincia);
    const comuna = first(base.comuna, envio.comuna, base.ciudad, envio.ciudad, envio.localidad, envio.town, envio.city);

    setForm((prev) => ({
      ...prev,
      nombre: prev.nombre || nombre,
      apellido: prev.apellido || apellido,
      email: prev.email || email,
      calle: prev.calle || calle,
      departamento: prev.departamento || departamento,
      region: prev.region || region,
      comuna: prev.comuna || comuna,
    }));
  }, []);

  function validate() {
    const errs = [];
    if (!form.nombre.trim()) errs.push("El nombre es requerido.");
    if (!form.apellido.trim()) errs.push("El apellido es requerido.");
    if (!form.email.trim() || !form.email.includes("@")) errs.push("El correo es inválido.");
    if (!form.calle.trim()) errs.push("La calle/dirección es requerida.");

    const regionEntry = REGIONES.find((r) => r.region === form.region);
    if (!form.region.trim()) {
      errs.push("Debes ingresar una región.");
    } else if (!regionEntry) {
      errs.push("La región ingresada no existe.");
    }

    if (!form.comuna.trim()) {
      errs.push("Debes ingresar una comuna.");
    } else if (regionEntry && !regionEntry.comunas.includes(form.comuna)) {
      errs.push("La comuna no pertenece a la región ingresada.");
    }

    return errs;
  }

  return { form, setField, validate };
}
