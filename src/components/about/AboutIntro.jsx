// usado por NosotrosPage.jsx
// src/components/about/AboutIntro.jsx
export default function AboutIntro() {
  return (
    <section className="about container py-5">
      <div className="row gy-4">
        <div className="col-12">
          <h2 className="about__title display-6 mb-3">Sobre Nosotros</h2>
          <p className="about__intro lead mb-0">
            En <strong>Poké&nbsp;Mart</strong> equipamos a entrenadores y aventureros con productos confiables:
            Poké Balls, artículos de curación, tecnología, expedición, transporte y ropa temática.
            Nuestro objetivo es que vivas tu aventura con seguridad, estilo y al mejor precio.
          </p>
        </div>
      </div>
    </section>
  );
}
