// usado por NosotrosPage.jsx
// src/components/about/AboutInfoCard.jsx
export default function AboutInfoCard({
  title = "Dónde estamos",
  address = {
    name: "Poké Mart — Sucursal Central",
    lines: ["Av. Kanto 151, Ciudad Carmín", "Región de Kanto"],
  },
  children,
}) {
  return (
    <div className="about-info__block mb-4 mb-lg-4">
      <h3 className="about-info__heading h4">{title}</h3>
      <address className="about-info__address mb-3">
        <div className="fw-semibold">{address.name}</div>
        {address.lines?.map((l, i) => <div key={i}>{l}</div>)}
      </address>
      <p className="about-info__text mb-0">
        {children ?? (
          <>
            Desde nuestra base central gestionamos inventario y envíos a toda la región.
            Probamos cada artículo para asegurar calidad, y trabajamos con proveedores
            certificados para garantizar autenticidad y durabilidad.
          </>
        )}
      </p>
    </div>
  );
}
