import { useState } from "react";
import "@/assets/styles/reviews.css";

const ratingOptions = [5, 4, 3, 2, 1];

export default function ReviewForm({ onSubmit, disabled }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!comment.trim()) {
      setError("El comentario es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit?.({ rating, comment: comment.trim() });
      setSuccess("Rese\u00f1a enviada.");
      setComment("");
    } catch (err) {
      setError(err?.message || "No se pudo enviar la rese\u00f1a.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form card p-3 mb-4" onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Deja tu opini\u00f3n</strong>
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Calificaci\u00f3n</label>
        <div className="d-flex gap-2">
          {ratingOptions.map((value) => (
            <button
              key={value}
              type="button"
              className={`btn btn-sm ${rating === value ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setRating(value)}
            >
              {value} ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="review-comment">
          Comentario
        </label>
        <textarea
          id="review-comment"
          className="form-control"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1200}
          required
          placeholder="Comparte tu experiencia con este producto"
        />
      </div>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success py-2" role="status">
          {success}
        </div>
      )}
      <button type="submit" className="btn btn-primary" disabled={loading || disabled}>
        {loading ? "Enviando..." : "Enviar rese\u00f1a"}
      </button>
    </form>
  );
}
