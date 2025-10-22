// usado por ContactoPage.jsx
// src/components/contact/ContactInfoCard.jsx
export default function ContactInfoCard({
  variant = "primary",
  title,
  addressLines = [],
  email,
  phone,
}) {
  return (
    <article className={`contacto-card contacto-card--${variant} h-100`}>
      <h2 className="h5 contacto-card__title">{title}</h2>

      <p className="mb-2 contacto-card__text">
        {addressLines.map((line, i) => (
          <span key={i}>
            {line}
            {i < addressLines.length - 1 && <><br /></>}
          </span>
        ))}
      </p>

      {email && (
        <a className="contacto-card__link" href={`mailto:${email}`}>
          {email}
        </a>
      )}
      {phone && <span className="d-block contacto-card__phone">{phone}</span>}
    </article>
  );
}
