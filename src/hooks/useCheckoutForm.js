// usado por el CheckoutPage.jsx
// src/hooks/useCheckoutForm.js
import { useEffect, useState } from "react";
import { getAuth, getProfile } from "@/components/auth/session";
import { REGIONES } from "@/data/regiones";

const first = (...vals) => vals.find((v) => v !== undefined && v !== null && String(v).trim() !== "") ?? "";

export function useCheckoutForm() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    calle: "",
    departamento: "",
    region: "",
    comuna: "",
    notas: "",
    paymentMethod: "credit",
  });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Prefill desde sesión
  useEffect(() => {
    const auth = getAuth();
    const profile = getProfile();
    if (!auth || !profile) return;

    const base = profile;

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

  const resetForm = () =>
    setForm({
      nombre: "",
      apellido: "",
      email: "",
      calle: "",
      departamento: "",
      region: "",
      comuna: "",
      notas: "",
      paymentMethod: "credit",
    });

  const setRegion = (region) => {
    setField("region", region);
    const regionObj = REGIONES.find((r) => r.region === region);
    if (!regionObj) {
      setField("comuna", "");
    } else if (!regionObj.comunas.some((c) => c === form.comuna)) {
      setField("comuna", regionObj.comunas[0] ?? "");
    }
  };

  return {
    form,
    setField,
    setRegion,
    resetForm,
  };
}
