// src/components/layout/Header.jsx
import AuthMenu from "@/components/auth/AuthMenu.jsx";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, getProfile } from "@/components/auth/session.js";
import { showCartGuardModal, CartGuardModal } from "@/components/auth/CartGuardModal.jsx";

import { getCount } from "@/lib/cartStore";

export const Header = () => {
  const [cartCount, setCartCount] = useState(() => {
    try {
      return getCount();
    } catch {
      return parseInt(localStorage.getItem("cartCount") || "0", 10);
    }
  });

  const navigate = useNavigate();

  const handleCartClick = (e) => {
    const auth = getAuth();
    const profile = getProfile();
    const role = (profile?.role || "").toLowerCase();
    const allowed = auth && profile && (role === "cliente" || role === "admin");
    if (!allowed) {
      e.preventDefault();
      e.stopPropagation();
      showCartGuardModal();
    } else {
      navigate("/carrito");
    }
  };

  useEffect(() => {
    const update = () => {
      try {
        setCartCount(getCount());
      } catch {
        setCartCount(parseInt(localStorage.getItem("cartCount") || "0", 10));
      }
    };
    window.addEventListener("cart:updated", update);
    window.addEventListener("storage", update);
    update();
    return () => {
      window.removeEventListener("cart:updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <header className="site-header">
      <nav className="site-nav navbar navbar-expand-lg bg-body-tertiary" aria-label="Navegación principal">
        <div className="container">
          <Link className="site-nav__brand navbar-brand d-flex align-items-center" to="/">
            <img
              className="site-nav__logo me-2"
              src="/src/assets/img/poke-mark-logo.png"
              alt="Logo Poké Mart"
              width="32"
              height="32"
            />
            <span className="site-nav__title">Poké Mart</span>
          </Link>

          <button
            className="site-nav__toggler navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainMenu"
            aria-controls="mainMenu"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="site-nav__menu collapse navbar-collapse" id="mainMenu">
            <ul className="site-nav__list navbar-nav me-auto mb-2 mb-lg-0">
              <li className="site-nav__item nav-item">
                <NavLink end className="site-nav__link nav-link" to="/">Home</NavLink>
              </li>
              <li className="site-nav__item nav-item">
                <NavLink className="site-nav__link nav-link" to="/catalogo">Productos</NavLink>
              </li>
              <li className="site-nav__item nav-item">
                <NavLink className="site-nav__link nav-link" to="/ofertas">Ofertas</NavLink>
              </li>
              <li className="site-nav__item nav-item">
                <NavLink className="site-nav__link nav-link" to="/nosotros">Nosotros</NavLink>
              </li>
              <li className="site-nav__item nav-item">
                <NavLink className="site-nav__link nav-link" to="/blog">Blogs</NavLink>
              </li>
              <li className="site-nav__item nav-item">
                <NavLink className="site-nav__link nav-link" to="/contacto">Contacto</NavLink>
              </li>
            </ul>

            {/* Acciones (sin buscador) */}
            <div className="site-nav__actions d-flex align-items-center gap-3">
              <AuthMenu />

              <button
                className="site-nav__cart btn btn-outline-primary position-relative"
                onClick={handleCartClick}
                aria-label="Ver carrito"
                type="button"
              >
                <span className="site-nav__cart-icon" aria-hidden="true">🛒</span>
                <span
                  className="site-nav__cart-badge badge text-bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
                  id="cartCount"
                  aria-live="polite"
                  style={{ minWidth: 18 }}
                >
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <CartGuardModal />
    </header>
  );
};
