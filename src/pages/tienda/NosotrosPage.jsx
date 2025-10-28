// src/pages/tienda/NosotrosPage.jsx
import { useEffect } from "react";
import "@/assets/styles/nosotros.css";

import PageBorders from "@/components/layout/PageBorders";
import AboutIntro from "@/components/about/AboutIntro";
import AboutInfoCard from "@/components/about/AboutInfoCard";
import SocialLinks from "@/components/about/SocialLinks";
import AboutMap from "@/components/about/AboutMap";

export default function NosotrosPage() {
  useEffect(() => {
    document.body.classList.add("page--nosotros");
    return () => document.body.classList.remove("page--nosotros");
  }, []);

  return (
    <>
      <PageBorders />

      <main id="main" className="site-main flex-grow-1 pb-5">
        <AboutIntro />

        <section className="about-info container pb-5 mb-5">
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-5">
              <AboutInfoCard />
              <SocialLinks />
            </div>

            <div className="col-12 col-lg-7 d-flex">
              <AboutMap />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
