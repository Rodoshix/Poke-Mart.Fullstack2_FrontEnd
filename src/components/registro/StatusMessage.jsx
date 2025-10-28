// src/components/registro/StatusMessage.jsx
export default function StatusMessage({ text, error }) {
  return (
    <p
      className={`registro__status ${error ? "registro__status--error" : ""}`}
      role="status"
      aria-live="polite"
    >
      {text}
    </p>
  );
}
