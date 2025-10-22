// src/components/checkout/CheckoutAddressForm.jsx
import { REGIONES } from "@/data/regiones";

export default function CheckoutAddressForm({ form, setField }) {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="h6">Información del cliente</h2>
        <p className="text-secondary small">Se autocompleta si iniciaste sesión. Puedes editarla.</p>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre*</label>
            <input className="form-control" value={form.nombre} onChange={(e) => setField("nombre", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Apellidos*</label>
            <input className="form-control" value={form.apellido} onChange={(e) => setField("apellido", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Correo*</label>
            <input type="email" className="form-control" value={form.email} onChange={(e) => setField("email", e.target.value)} />
          </div>
        </div>

        <h2 className="h6 mt-4">Dirección de entrega</h2>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Calle*</label>
            <input className="form-control" placeholder="Ej: Calle Principal 123" value={form.calle} onChange={(e) => setField("calle", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Departamento (opcional)</label>
            <input className="form-control" placeholder="Ej: 603" value={form.departamento} onChange={(e) => setField("departamento", e.target.value)} />
          </div>

          {/* Inputs libres, como en tu diseño original */}
          <div className="col-md-6">
            <label className="form-label">Región*</label>
            <input className="form-control" placeholder="Ej: Kanto" value={form.region} onChange={(e) => setField("region", e.target.value)} />
            <div className="form-text">Debe ser una de: {REGIONES.map((r) => r.region).join(", ")}.</div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Comuna*</label>
            <input className="form-control" placeholder="Ej: Ciudad Celeste" value={form.comuna} onChange={(e) => setField("comuna", e.target.value)} />
            {!!form.region && REGIONES.find((r) => r.region === form.region)?.comunas?.length > 0 && (
              <div className="form-text">
                Comunas válidas para {form.region}: {REGIONES.find((r) => r.region === form.region).comunas.join(", ")}.
              </div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label">Indicaciones (opcional)</label>
            <textarea className="form-control" rows={3} placeholder="Ej: Entre calles, color del edificio, no tiene timbre…" value={form.notas} onChange={(e) => setField("notas", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
