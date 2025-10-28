// usado por ContactoPage.jsx
// src/hooks/useContactoForm.js
import { useEffect, useMemo, useState } from "react";

const ALLOWED_DOMAINS = ["duoc.cl", "profesor.duoc.cl", "gmail.com", "gmail.cl"];
const NAME_MIN = 3;
const MESSAGE_MIN = 10;

export function useContactoForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ text: "", error: false });
  const [sending, setSending] = useState(false);

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

  const nameError = useMemo(() => {
    const n = name.trim();
    return n && n.length < NAME_MIN
      ? `El nombre debe tener al menos ${NAME_MIN} caracteres.`
      : "";
  }, [name]);

  const messageError = useMemo(() => {
    const m = message.trim();
    return m && m.length < MESSAGE_MIN
      ? `El mensaje debe tener al menos ${MESSAGE_MIN} caracteres.`
      : "";
  }, [message]);

  useEffect(() => {
    if (nameError) setStatus({ text: nameError, error: true });
    else if (messageError) setStatus({ text: messageError, error: true });
    else if (emailError) setStatus({ text: emailError, error: true });
    else setStatus({ text: "", error: false });
  }, [nameError, messageError, emailError]);

  const onSubmit = (e) => {
    e?.preventDefault?.();
    const n = name.trim();
    const m = message.trim();

    if (!n || !email.trim() || !m) {
      setStatus({ text: "Por favor completa todos los campos.", error: true });
      return;
    }
    if (nameError || messageError || emailError) return;

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

  return {
    fields: { name, email, message },
    set: { setName, setEmail, setMessage },
    errors: { nameError, emailError, messageError },
    status,
    sending,
    onSubmit,
  };
}
