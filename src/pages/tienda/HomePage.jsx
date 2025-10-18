// src/pages/HomePage.jsx
import { useEffect, useMemo, useState } from "react";
import productsData from "@/data/productos.json";           // ajusta si tu JSON está en otra ruta
import "@/assets/styles/home.css";

import { HeroCarousel } from "@/components/ui/HeroCarousel.jsx";
import { ProductCard } from "@/components/catalog/ProductCard.jsx";

// util: seleccionar destacados igual que en tu versión anterior
const pickFeatured = (data) => {
  const pokeballs = data.filter(p => p.categoria === "Poké Balls").slice(0, 2);
  const curacion  = data.filter(p => p.categoria === "Curación").slice(0, 2);
  const otras     = data.filter(p => !["Poké Balls","Curación"].includes(p.categoria)).slice(0, 4);
  return [...pokeballs, ...curacion, ...otras].slice(0, 8);
};

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // imágenes (según tu estructura)
  const leftBorder  = "/src/assets/img/background-logo.png";
  const rightBorder = "/src/assets/img/background-logo.png";

  const slides = useMemo(() => ([
    { src: "/src/assets/img/tienda/world/pokemon_galar_map.png",  alt: "Región de Galar para explorar" },
    { src: "/src/assets/img/tienda/world/Pokemon_sinnoh_map.png", alt: "Región de Sinnoh para explorar" },
    { src: "/src/assets/img/tienda/world/pokemon_worldmap2.png",  alt: "Región de Johto para explorar" },
  ]), []);

  // carga de destacados (desde el JSON importado)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    // simulamos una carga asíncrona corta para respetar el patrón con useEffect
    const t = setTimeout(() => {
      if (!alive) return;
      const destacados = pickFeatured(productsData || []);
      setItems(destacados);
      setLoading(false);
    }, 200);
    return () => { alive = false; clearTimeout(t); };
  }, []);

  return (
    <main className="site-main">
      {/* bordes laterales */}
      <img src={leftBorder} className="left-border" alt="" aria-hidden="true" decoding="async" loading="lazy" />
      <img src={rightBorder} className="right-border" alt="" aria-hidden="true" decoding="async" loading="lazy" />

      {/* HERO */}
      <section className="hero container py-5">
        <div className="row align-items-center g-4">
          <div className="hero__content col-12 col-lg-6">
            <h1 className="hero__title display-5">
              Tienda online <span className="font-orbitron">Poké&nbsp;Mart</span>
            </h1>
            <p className="hero__subtitle lead">
              Equípate para tu aventura: Poké Balls, curación, ropa, transporte, expedición y tecnología.
            </p>
            <a className="hero__cta btn btn-primary btn-lg" href="/catalogo">Ver productos</a>
          </div>

          <div className="hero__media col-12 col-lg-6">
            <HeroCarousel slides={slides} />
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="product-grid container py-5">
        <header className="product-grid__header d-flex justify-content-between align-items-center mb-4">
          <h2 className="product-grid__title h3 m-0">Productos destacados</h2>
          <a className="product-grid__more btn btn-outline-secondary btn-sm" href="/catalogo">Ver todo</a>
        </header>

        <div className="product-grid__list row g-4" aria-live="polite">
          {loading && <div className="col-12 text-muted">Cargando destacados…</div>}

          {!loading && items.map(p => (
            <div key={p.id} className="product-grid__item col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
