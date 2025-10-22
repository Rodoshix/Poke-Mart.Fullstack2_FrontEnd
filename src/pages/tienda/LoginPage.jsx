// src/pages/tienda/LoginPage.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "@/assets/styles/login.css";
import bgLogin from "@/assets/img/login.gif";
import logoPoke from "@/assets/img/poke-mark-logo.png";

import { useLogin } from "@/hooks/useLogin";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog";

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const {
    // login
    username, setUsername,
    password, setPassword,
    remember, setRemember,
    error, handleSubmit,
    // forgot
    forgotOpen, openForgot, closeForgot,
    forgotStep, forgotEmail, setForgotEmail,
    forgotErr, demoCode, handleForgotEmail, confirmCode,
  } = useLogin({ navigate, params });

  useEffect(() => {
    document.body.classList.add("page--login");
    document.body.style.setProperty("--login-bg", `url(${bgLogin})`);
    return () => {
      document.body.classList.remove("page--login");
      document.body.style.removeProperty("--login-bg");
    };
  }, []);

  return (
    <main className="login d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <LoginForm
        logoSrc={logoPoke}
        username={username} setUsername={setUsername}
        password={password} setPassword={setPassword}
        remember={remember} setRemember={setRemember}
        error={error}
        onSubmit={handleSubmit}
        onOpenForgot={openForgot}
      />

      <ForgotPasswordDialog
        open={forgotOpen}
        onClose={closeForgot}
        step={forgotStep}
        forgotEmail={forgotEmail}
        setForgotEmail={setForgotEmail}
        forgotErr={forgotErr}
        demoCode={demoCode}
        onSubmitEmail={handleForgotEmail}
        onConfirmCode={confirmCode}
      />
    </main>
  );
}
