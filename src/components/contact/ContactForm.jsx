// usado por ContactoPage.jsx
// src/components/contact/ContactForm.jsx
import { useContactoForm } from "@/hooks/useContactoForm";

export default function ContactForm() {
  const { fields, set, errors, status, sending, onSubmit } = useContactoForm();

  return (
    <form className="contacto-form" noValidate onSubmit={onSubmit}>
      <div className="contacto-form__group">
        <input
          id="contactName"
          name="name"
          type="text"
          className={`contacto-form__input ${errors.nameError ? "is-invalid" : ""}`}
          placeholder="Ingresa tu nombre"
          value={fields.name}
          onChange={(e) => set.setName(e.target.value)}
          aria-label="Nombre"
          required
        />
      </div>

      <div className="contacto-form__group">
        <input
          id="contactEmail"
          name="email"
          type="email"
          className={`contacto-form__input ${errors.emailError ? "is-invalid" : ""}`}
          placeholder="Ingresa un correo válido"
          value={fields.email}
          onChange={(e) => set.setEmail(e.target.value)}
          aria-label="Correo electrónico"
          required
        />
      </div>

      <div className="contacto-form__group">
        <textarea
          id="contactMessage"
          name="message"
          className={`contacto-form__input contacto-form__input--textarea ${errors.messageError ? "is-invalid" : ""}`}
          placeholder="Ingresa tu mensaje"
          value={fields.message}
          onChange={(e) => set.setMessage(e.target.value)}
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
  );
}
