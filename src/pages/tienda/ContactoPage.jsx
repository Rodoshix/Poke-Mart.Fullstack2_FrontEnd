// src/pages/tienda/ContactoPage.jsx
import { useEffect, useMemo, useState } from "react";
import "@/assets/styles/contacto.css";

const MAP_IMG = "/src/assets/img/tienda/world/pokemon_galar_map.png";
const BG = "/src/assets/img/background-logo.png";

const ALLOWED_DOMAINS = ["duoc.cl", "profesor.duoc.cl", "gmail.com", "gmail.cl"];
const NAME_MIN = 3;
const MESSAGE_MIN = 10;

export default function ContactoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ text: "", error: false });
  const [sending, setSending] = useState(false);

  // aplicar estilos de página
  useEffect(() => {
    document.body.classList.add("page--contacto");
    return () => document.body.classList.remove("page--contacto");
  }, []);

  const emailError = useMemo(() => {
    const v = email.trim();
    if (!v) return "";
    if (!v.includes("@")) return "El correo debe incluir @.";
    const [local, domain] = v.split("@");
    if (!local) return "El correo debe incluir @.";
    if (!domain || !domain.includes(".")) return "El dominio debe incluir un punto (.).";
    if (!ALLOWED_DOMAINS.includes(domain.toLowerCase())) {
      return "Solo aceptamos correos duoc.cl, profesor.duoc.cl, gmail.com o gmail.cl.";
    }
    return "";
  }, [email]);

  const nameError = useMemo(
    () => (name.trim() && name.trim().length < NAME_MIN ? `El nombre debe tener al menos ${NAME_MIN} caracteres.` : ""),
    [name]
  );
  const messageError = useMemo(
    () =>
      message.trim() && message.trim().length < MESSAGE_MIN
        ? `El mensaje debe tener al menos ${MESSAGE_MIN} caracteres.`
        : "",
    [message]
  );

  useEffect(() => {
    if (nameError) setStatus({ text: nameError, error: true });
    else if (messageError) setStatus({ text: messageError, error: true });
    else if (emailError) setStatus({ text: emailError, error: true });
    else setStatus({ text: "", error: false });
  }, [nameError, messageError, emailError]);

  const onSubmit = (e) => {
    e.preventDefault();
    const n = name.trim();
    const m = message.trim();

    if (!n || !email.trim() || !m) {
      setStatus({ text: "Por favor completa todos los campos.", error: true });
      return;
    }
    if (nameError || messageError || emailError) {
      // ya hay texto en status por el efecto
      return;
    }

    setSending(true);
    setStatus({ text: "", error: false });
    setTimeout(() => {
      setSending(false);
      setStatus({ text: "Gracias, recibimos tu mensaje. Te contactaremos pronto.", error: false });
      setName("");
      setEmail("");
      setMessage("");
    }, 900);
  };

  return (
    <>
      {/* Bordes laterales */}
      <img src={BG} className="left-border" alt="" aria-hidden="true" decoding="async" loading="lazy" />
      <img src={BG} className="right-border" alt="" aria-hidden="true" decoding="async" loading="lazy" />

      <main className="contacto-main container py-5">
        <div className="row g-5 align-items-center contacto-hero">
          <div className="col-12 col-lg-6">
            <span className="badge rounded-pill text-bg-light contacto-kicker">Estamos para ayudarte</span>
            <h1 className="contacto-title mt-3 mb-3">Nuestro contacto</h1>
            <p className="contacto-lead text-secondary mb-4">
              Cuéntanos qué necesitas para tu próxima aventura Pokémon. Responderemos tu mensaje a la brevedad.
            </p>

            <form className="contacto-form" noValidate onSubmit={onSubmit}>
              <div className="contacto-form__group">
                <input
                  id="contactName"
                  name="name"
                  type="text"
                  className={`contacto-form__input ${nameError ? "is-invalid" : ""}`}
                  placeholder="Ingresa tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Nombre"
                  required
                />
              </div>

              <div className="contacto-form__group">
                <input
                  id="contactEmail"
                  name="email"
                  type="email"
                  className={`contacto-form__input ${emailError ? "is-invalid" : ""}`}
                  placeholder="Ingresa un correo válido"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Correo electrónico"
                  required
                />
              </div>

              <div className="contacto-form__group">
                <textarea
                  id="contactMessage"
                  name="message"
                  className={`contacto-form__input contacto-form__input--textarea ${messageError ? "is-invalid" : ""}`}
                  placeholder="Ingresa tu mensaje"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-label="Mensaje"
                  required
                />
              </div>

              <button type="submit" className="contacto-form__btn btn btn-primary" disabled={sending}>
                {sending ? "Enviando..." : "Enviar mensaje"}
              </button>

              <p
                className={`contacto-form__status ${status.error ? "contacto-form__status--error" : ""}`}
                role="status"
                aria-live="polite"
              >
                {status.text}
              </p>
            </form>
          </div>

          <div className="col-12 col-lg-6">
            <figure className="contacto-figure mb-0">
              <img src={MAP_IMG} alt="Mapa del mundo Pokémon" className="contacto-figure__img" />
            </figure>
          </div>
        </div>

        <div className="row g-4 contacto-cards mt-5">
          <div className="col-12 col-lg-6">
            <article className="contacto-card contacto-card--primary h-100">
              <h2 className="h5 contacto-card__title">Centro de soporte Kanto</h2>
              <p className="mb-2 contacto-card__text">
                Avenida Celeste 123, Torre Poké
                <br />
                Ciudad Azafrán, Región Kanto
              </p>
              <a className="contacto-card__link" href="mailto:soporte@pokemart.cl">
                soporte@pokemart.cl
              </a>
              <span className="d-block contacto-card__phone">+56 2 1234 5678</span>
            </article>
          </div>
          <div className="col-12 col-lg-6">
            <article className="contacto-card contacto-card--secondary h-100">
              <h2 className="h5 contacto-card__title">Laboratorio de Pokébolas Hoenn</h2>
              <p className="mb-2 contacto-card__text">
                Ruta 114, Cascada Meteoro, Parque Tecnológico 4F
                <br />
                Ciudad Portual, Región Hoenn
              </p>
              <a className="contacto-card__link" href="mailto:alianzas@pokemart.cl">
                alianzas@pokemart.cl
              </a>
              <span className="d-block contacto-card__phone">+56 2 9876 5432</span>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}
