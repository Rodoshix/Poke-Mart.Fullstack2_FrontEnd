// src/pages/HomePage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useProductsData from "@/hooks/useProductsData.js";
import "@/assets/styles/home.css";
import LoaderOverlay from "@/components/common/LoaderOverlay.jsx";

import { HeroCarousel } from "@/components/home/HeroCarousel.jsx";
import { ProductCard } from "@/components/catalog/ProductCard.jsx";
import PageBorders from "@/components/layout/PageBorders";

const pickFeatured = (data) => {
  const pokeballs = data.filter(p => p.categoria === "Poké Balls").slice(0, 2);
  const curacion  = data.filter(p => p.categoria === "Curación").slice(0, 2);
  const otras     = data.filter(p => !["Poké Balls","Curación"].includes(p.categoria)).slice(0, 4);
  return [...pokeballs, ...curacion, ...otras].slice(0, 8);
};

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const products = useProductsData();

  const slides = useMemo(() => ([
    { src: "/src/assets/img/tienda/world/pokemon_galar_map.png",  alt: "Región de Galar para explorar" },
    { src: "/src/assets/img/tienda/world/Pokemon_sinnoh_map.png", alt: "Región de Sinnoh para explorar" },
    { src: "/src/assets/img/tienda/world/pokemon_worldmap2.png",  alt: "Región de Johto para explorar" },
  ]), []);

  useEffect(() => {
    let alive = true;
    setDataReady(false);
    setMinDelayPassed(false);

    const delayTimer = setTimeout(() => setMinDelayPassed(true), 3000);
    const dataTimer = setTimeout(() => {
      if (!alive) return;
      const destacados = pickFeatured(products || []);
      setItems(destacados);
      setDataReady(true);
    }, 120);

    return () => { alive = false; clearTimeout(delayTimer); clearTimeout(dataTimer); };
  }, [products]);

  const showLoader = !minDelayPassed || !dataReady;

  return (
    <main className="site-main">
      <PageBorders />
      <section className="hero container py-5">
        <div className="row align-items-center g-4">
          <div className="hero__content col-12 col-lg-6">
            <h1 className="hero__title display-5">
              Tienda online <span className="font-orbitron">Poké&nbsp;Mart</span>
            </h1>
            <p className="hero__subtitle lead">
              Equípate para tu aventura: Poké Balls, curación, ropa, transporte, expedición y tecnología.
            </p>
            <Link className="hero__cta btn btn-primary btn-lg" to="/catalogo">Ver productos</Link>
          </div>

          <div className="hero__media col-12 col-lg-6">
            <HeroCarousel slides={slides} />
          </div>
        </div>
      </section>

      <section className="product-grid container py-5">
        <header className="product-grid__header d-flex justify-content-between align-items-center mb-4">
          <h2 className="product-grid__title h3 m-0">Productos destacados</h2>
          <Link className="product-grid__more btn btn-outline-secondary btn-sm" to="/catalogo">Ver todo</Link>
        </header>

        <div className="product-grid__list row g-4" aria-live="polite">
          {showLoader ? (
            <div className="col-12">
              <LoaderOverlay text="Cargando destacados..." />
            </div>
          ) : (
            items.map(p => (
              <div key={p.id} className="product-grid__item col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={p} />
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
