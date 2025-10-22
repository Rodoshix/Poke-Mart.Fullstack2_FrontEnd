// src/components/contact/ContactForm.jsx
import { useContactoForm } from "@/hooks/useContactoForm";

export default function ContactForm() {
  const {
    fields: { name, email, message },
    set: { setName, setEmail, setMessage },
    errors: { nameError, emailError, messageError },
    status,
    sending,
    onSubmit,
  } = useContactoForm();

  const nameId = "contactName";
  const emailId = "contactEmail";
  const msgId = "contactMessage";
  const statusId = "contactStatus";

  return (
    <form className="contacto-form" noValidate onSubmit={onSubmit} aria-describedby={statusId}>
      {/* Nombre */}
      <div className="contacto-form__group">
        <label htmlFor={nameId} className="visually-hidden">Nombre</label>
        <input
          id={nameId}
          name="name"
          type="text"
          className={`contacto-form__input ${nameError ? "is-invalid" : ""}`}
          placeholder="Ingresa tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!nameError}
          autoComplete="name"
          required
        />
      </div>

      {/* Email */}
      <div className="contacto-form__group">
        <label htmlFor={emailId} className="visually-hidden">Correo electrónico</label>
        <input
          id={emailId}
          name="email"
          type="email"
          className={`contacto-form__input ${emailError ? "is-invalid" : ""}`}
          placeholder="Ingresa un correo válido"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!emailError}
          autoComplete="email"
          required
        />
      </div>

      {/* Mensaje */}
      <div className="contacto-form__group">
        <label htmlFor={msgId} className="visually-hidden">Mensaje</label>
        <textarea
          id={msgId}
          name="message"
          className={`contacto-form__input contacto-form__input--textarea ${messageError ? "is-invalid" : ""}`}
          placeholder="Ingresa tu mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!messageError}
          autoComplete="off"
          required
        />
      </div>

      <button type="submit" className="contacto-form__btn btn btn-primary" disabled={sending}>
        {sending ? "Enviando..." : "Enviar mensaje"}
      </button>

      <p
        id={statusId}
        className={`contacto-form__status ${status.error ? "contacto-form__status--error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status.text}
      </p>
    </form>
  );
}
