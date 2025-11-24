import "@/assets/styles/loader.css";

export default function LoaderOverlay({ text = "Cargando..." }) {
  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-spinner" aria-hidden="true" />
      <p className="loader-text">{text}</p>
    </div>
  );
}
