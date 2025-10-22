// usado por LoginPage.jsx
// src/components/auth/LoginForm.jsx
import { Link } from "react-router-dom";

export default function LoginForm({
  logoSrc,
  username, setUsername,
  password, setPassword,
  remember, setRemember,
  error,
  onSubmit,
  onOpenForgot,
}) {
  return (
    <section
      className="login__wrapper p-4"
      style={{ width: "min(92vw, 420px)", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,.25)", zIndex: 1 }}
      aria-labelledby="loginTitle"
    >
      <header className="login__header text-center mb-3">
        <div className="logo-container">
          <img className="login__logo" src={logoSrc} alt="Logo Poké Mart" width="48" height="48" />
          <h1 className="login__empresa m-0">Poké Mart</h1>
        </div>
        <h2 id="loginTitle" className="login__title mt-2">Login</h2>
      </header>

      <form className="login__form" onSubmit={onSubmit} noValidate>
        <div className="login__field">
          <input
            id="username"
            type="text"
            className="login__input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <span className="login__icon bi bi-person" aria-hidden="true" />
        </div>

        <div className="login__field">
          <input
            id="password"
            type="password"
            className="login__input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <span className="login__icon bi bi-lock" aria-hidden="true" />
        </div>

        <div className="login__options">
          <label className="login__remember">
            <input
              type="checkbox"
              className="login__checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recuérdame
          </label>

          <button type="button" className="login__link btn btn-link p-0" onClick={onOpenForgot}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {error ? <p className="login__error" style={{ color: "#ffd2d2" }}>{error}</p> : null}

        <button type="submit" className="login__button">Login</button>

        <p className="login__register">
          ¿No tienes una cuenta? <Link className="login__link" to="/registro">Registrar</Link>
        </p>
      </form>
    </section>
  );
}
