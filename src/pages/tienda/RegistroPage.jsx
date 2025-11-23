// src/pages/tienda/RegistroPage.jsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@/assets/styles/registro.css";

import { REGIONES as REGIONS } from "@/data/regiones";
import { LOGO } from "@/components/registro/constants";
import Field from "@/components/registro/Field";
import StatusMessage from "@/components/registro/StatusMessage";
import { useRegistroForm } from "@/components/registro/useRegistroForm";

export default function RegistroPage() {
  useEffect(() => {
    document.body.classList.add("page--registro");
    return () => document.body.classList.remove("page--registro");
  }, []);

  const navigate = useNavigate();
  const { form, setField, status, comunas, onBlurRun, onChangeRegion, onSubmit } = useRegistroForm({
    onSuccess: () => navigate("/", { replace: true }),
  });

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
            <Field
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
              placeholder="Nombre"
              required
            />
            <Field
              label="Apellido"
              name="apellido"
              value={form.apellido}
              onChange={(e) => setField("apellido", e.target.value)}
              placeholder="Apellido"
              required
            />
          </div>

          <div className="registro__row">
            <Field
              label="RUN"
              name="run"
              value={form.run}
              onChange={(e) => setField("run", e.target.value)}
              onBlur={onBlurRun}
              placeholder="98765432K"
              required
            />
            <Field
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              type="date"
              value={form.fechaNacimiento}
              onChange={(e) => setField("fechaNacimiento", e.target.value)}
              required
            />
          </div>

          <div className="registro__row">
            <Field
              label="Región"
              name="region"
              as="select"
              value={form.region}
              onChange={(e) => onChangeRegion(e.target.value)}
              required
              options={[{ value: "", label: "Selecciona una region" }, ...REGIONS.map(r => ({ value: r.region, label: r.region }))]}
            />
            <Field
              label="Ciudad / Comuna"
              name="comuna"
              as="select"
              value={form.comuna}
              onChange={(e) => setField("comuna", e.target.value)}
              required
              options={[{ value: "", label: "Selecciona una ciudad" }, ...comunas]}
            />
          </div>

          <Field
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={(e) => setField("direccion", e.target.value)}
            placeholder="Oficina Central Poke Mart"
            required
          />

          <div className="registro__row registro__row--telefono">
            <Field
              label="Codigo"
              name="telefonoCodigo"
              as="select"
              value={form.telefonoCodigo}
              onChange={(e) => setField("telefonoCodigo", e.target.value)}
              options={[{ value: "+56", label: "+56 (Chile)" }]}
              required
              className="registro__field--codigo"
            />
            <Field
              label="Telefono"
              name="telefonoNumero"
              type="tel"
              value={form.telefonoNumero}
              onChange={(e) => setField("telefonoNumero", e.target.value.replace(/\D/g, ""))}
              placeholder="912345678"
              required
            />
          </div>

          <StatusMessage text={status.text} error={status.error} />

          <div className="registro__row">
            <Field
              label="Nombre de usuario"
              name="username"
              value={form.username}
              onChange={(e) => setField("username", e.target.value)}
              placeholder="Usuario"
              required
            />
            <Field
              label="Correo electrónico"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="usuario@duoc.cl"
              required
            />
          </div>

          <div className="registro__row">
            <Field
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              placeholder="Contraseña"
              required
            />
            <Field
              label="Confirmar contraseña"
              name="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) => setField("passwordConfirm", e.target.value)}
              placeholder="Confirma contraseña"
              required
            />
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
