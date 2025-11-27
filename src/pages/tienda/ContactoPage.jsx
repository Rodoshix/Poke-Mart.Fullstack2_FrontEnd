// src/pages/tienda/ContactoPage.jsx
import { useEffect } from "react";
import "@/assets/styles/contacto.css";

import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import ContactInfoCard from "@/components/contact/ContactInfoCard";
import PageBorders from "@/components/layout/PageBorders";

export default function ContactoPage() {
  useEffect(() => {
    document.body.classList.add("page--contacto");
    return () => document.body.classList.remove("page--contacto");
  }, []);

  return (
    <>
      <PageBorders />

      <main className="contacto-main container py-5">
        <div className="row g-5 align-items-center contacto-hero">
          <div className="col-12 col-lg-6">
            <span className="badge rounded-pill text-bg-light contacto-kicker">Estamos para ayudarte</span>
            <h1 className="contacto-title mt-3 mb-3">Nuestro contacto</h1>
            <p className="contacto-lead text-secondary mb-4">
              Cuéntanos qué necesitas para tu próxima aventura Pokémon. Responderemos tu mensaje a la brevedad.
            </p>

            <ContactForm />
          </div>

          <div className="col-12 col-lg-6">
            <ContactMap />
          </div>
        </div>

        <div className="row g-4 contacto-cards mt-5">
          <div className="col-12 col-lg-6">
            <ContactInfoCard
              variant="primary"
              title="Centro de soporte Kanto"
              addressLines={[
                "Avenida Celeste 123, Torre Poké",
                "Ciudad Azafrán, Región Kanto",
              ]}
              email="soporte@pokemart.cl"
              phone="+56 2 1234 5678"
            />
          </div>

          <div className="col-12 col-lg-6">
            <ContactInfoCard
              variant="secondary"
              title="Laboratorio de Pokébolas Hoenn"
              addressLines={[
                "Ruta 114, Cascada Meteoro, Parque Tecnológico 4F",
                "Ciudad Portual, Región Hoenn",
              ]}
              email="alianzas@pokemart.cl"
              phone="+56 2 9876 5432"
            />
          </div>
        </div>
      </main>
    </>
  );
}
