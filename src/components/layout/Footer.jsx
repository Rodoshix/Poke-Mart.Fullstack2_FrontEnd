import { NavLink } from "react-router-dom";
import { useState } from "react";

/**
 * Props opcionales:
 * - onSubscribe?: (email: string) => void
 */
export function Footer({ onSubscribe }) {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // callback opcional hacia arriba; si no existe, solo hace un alert suave
    if (typeof onSubscribe === "function") onSubscribe(email);
    else alert(`¡Gracias por suscribirte, ${email}!`);
    setEmail("");
  };

  return (
    <footer className="site-footer bg-dark text-light mt-auto">
      <div className="container py-4">
        <div className="row gy-4">
          <div className="site-footer__col col-12 col-md-6 col-lg-4">
            <h3 className="site-footer__title h5">Poké Mart</h3>
            <p className="site-footer__text mb-0">
              Siempre a tu lado, donde quiera que vayas.
            </p>
          </div>

          {/* Enlaces rápidos (usa NavLink para SPA) */}
          <nav
            className="site-footer__col col-6 col-lg-4"
            aria-label="Enlaces rápidos"
          >
            <ul className="site-footer__links list-unstyled m-0">
              <li>
                <NavLink className="site-footer__link link-light" to="/catalogo">
                  Productos
                </NavLink>
              </li>
              <li>
                <NavLink className="site-footer__link link-light" to="/nosotros">
                  Nosotros
                </NavLink>
              </li>
              <li>
                <NavLink className="site-footer__link link-light" to="/blog">
                  Blogs
                </NavLink>
              </li>
              <li>
                <NavLink className="site-footer__link link-light" to="/contacto">
                  Contacto
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="site-footer__col col-6 col-lg-4">
            <form className="newsletter site-footer__newsletter" onSubmit={handleSubscribe} noValidate>
              <label className="newsletter__label form-label" htmlFor="emailNews">
                Suscríbete al boletín
              </label>
              <div className="newsletter__controls input-group">
                <input
                  id="emailNews"
                  className="newsletter__input form-control"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  id="btnNews"
                  className="newsletter__btn btn btn-primary"
                  type="submit"
                >
                  Suscribirme
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="site-footer__copy text-center pt-3 small text-secondary">
          © {new Date().getFullYear()} Poké Mart. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
