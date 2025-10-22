// src/pages/tienda/NosotrosPage.jsx
import { useEffect } from "react";
import "@/assets/styles/nosotros.css";

export default function NosotrosPage() {
  useEffect(() => {
    document.body.classList.add("page--nosotros");
    return () => document.body.classList.remove("page--nosotros");
  }, []);

  return (
    <>
      <img
        src="/src/assets/img/background-logo.png"
        className="left-border"
        alt=""
        aria-hidden="true"
        decoding="async"
        loading="lazy"
      />
      <img
        src="/src/assets/img/background-logo.png"
        className="right-border"
        alt=""
        aria-hidden="true"
        decoding="async"
        loading="lazy"
      />

      <main id="main" className="site-main flex-grow-1 pb-5">
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

        <section className="about-info container pb-5 mb-5">
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-5">
              <div className="about-info__block mb-4 mb-lg-4">
                <h3 className="about-info__heading h4">Dónde estamos</h3>
                <address className="about-info__address mb-3">
                  <div className="fw-semibold">Poké Mart — Sucursal Central</div>
                  <div>Av. Kanto 151, Ciudad Carmín</div>
                  <div>Región de Kanto</div>
                </address>
                <p className="about-info__text mb-0">
                  Desde nuestra base central gestionamos inventario y envíos a toda la región.
                  Probamos cada artículo para asegurar calidad, y trabajamos con proveedores
                  certificados para garantizar autenticidad y durabilidad.
                </p>
              </div>

              <aside className="about-social">
                <div className="about-social__card">
                  <h3 className="about-social__heading h4 mb-3">Síguenos</h3>
                  <ul className="about-social__list">
                    <li>
                      <a
                        className="about-social__link"
                        href="https://www.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="about-social__icon" aria-hidden="true"></span>
                        <span>Facebook</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="about-social__link"
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="about-social__icon" aria-hidden="true"></span>
                        <span>Instagram</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="about-social__link"
                        href="https://twitter.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="about-social__icon" aria-hidden="true"></span>
                        <span>Twitter</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="about-social__link"
                        href="https://www.linkedin.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="about-social__icon" aria-hidden="true"></span>
                        <span>LinkedIn</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>

            <div className="col-12 col-lg-7 d-flex">
              <div className="about-map flex-grow-1 d-flex flex-column">
                <h3 className="about-map__heading h4">Cómo llegar</h3>
                <div className="about-map__frame rounded overflow-hidden">
                  <img
                    className="about-map__img"
                    src="/src/assets/img/mapa-pokemart.png"
                    alt="Mapa de ubicación de Poké Mart — Sucursal Central"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
