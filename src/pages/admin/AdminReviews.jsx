import { useEffect, useMemo, useState } from "react";
import { fetchAdminReviews, deleteAdminReview } from "@/services/adminReviewApi.js";
import LoaderOverlay from "@/components/common/LoaderOverlay.jsx";

const formatDate = (value) => {
  if (!value) return "Reciente";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("es-CL");
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [filterCat, setFilterCat] = useState("");
  const [filterProduct, setFilterProduct] = useState("");

  const filteredReviews = reviews.filter((r) => {
    const okCat = !filterCat || r.category === filterCat;
    const okProd = !filterProduct || String(r.productId) === filterProduct;
    return okCat && okProd;
  });

  const load = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await fetchAdminReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "No se pudieron cargar las reseñas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const productOptions = useMemo(() => {
    const unique = [];
    const seen = new Set();
    reviews
      .filter((r) => (!filterCat || r.category === filterCat) && r.productId != null)
      .forEach((r) => {
        const key = String(r.productId);
        if (seen.has(key)) return;
        seen.add(key);
        unique.push({ id: r.productId, name: r.productName });
      });
    return unique.sort((a, b) => (a.name || "").localeCompare(b.name || "", "es"));
  }, [reviews, filterCat]);

  useEffect(() => {
    if (!filterProduct) return;
    const stillExists = productOptions.some((p) => String(p.id) === filterProduct);
    if (!stillExists) setFilterProduct("");
  }, [productOptions, filterProduct]);

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Eliminar esta reseña?");
    if (!ok) return;
    setProcessingId(id);
    try {
      await deleteAdminReview(id);
      setMessage("Reseña eliminada.");
      setError("");
      await load();
    } catch (err) {
      setError(err?.message || "No se pudo eliminar la reseña.");
      setMessage("");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="admin-paper admin-reviews">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reseñas</h1>
        <p className="admin-page-subtitle">
          Gestiona los comentarios de los clientes y elimina los inapropiados.
        </p>
      </div>

      {(message || error) && (
        <div className={`admin-products__alert${error ? " admin-products__alert--error" : ""}`} role={error ? "alert" : "status"}>
          {error || message}
        </div>
      )}

      <div className="admin-product-filters mb-3">
        <div className="admin-product-filters__group">
          <span className="admin-product-filters__label">Categoría</span>
          <select
            className="admin-product-filters__select"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="">Todas</option>
            {Array.from(new Set(reviews.map((r) => r.category).filter(Boolean)))
              .sort((a, b) => a.localeCompare(b, "es"))
              .map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
          </select>
        </div>
        <div className="admin-product-filters__group">
          <span className="admin-product-filters__label">Producto</span>
          <select
            className="admin-product-filters__select"
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
          >
            <option value="">Todos</option>
            {productOptions.map((p) => (
              <option key={p.id} value={p.id}>{`#${p.id} - ${p.name}`}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoaderOverlay text="Cargando reseñas..." />
      ) : (
        <div className="admin-product-table admin-review-table">
          <table className="admin-table admin-product-table__inner">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Autor</th>
                <th>Calificación</th>
                <th>Fecha</th>
                <th>Comentario</th>
                <th className="admin-product-table__actions-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-table__empty">
                    No hay reseñas registradas.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr key={r.id}>
                    <td className="admin-table__cell--mono">{r.id}</td>
                    <td>
                      <div className="admin-offers__product">
                        <span className="admin-table__cell--mono">#{r.productId}</span> {r.productName}
                      </div>
                    </td>
                    <td>{r.category || "Sin categoría"}</td>
                    <td>{r.author || "Cliente"}</td>
                    <td>{r.rating} ⭐</td>
                    <td>{formatDate(r.createdAt)}</td>
                    <td>{r.comment}</td>
                    <td>
                      <div className="admin-product-table__actions">
                        <button
                          type="button"
                          className="admin-product-table__action admin-product-table__action--danger"
                          onClick={() => handleDelete(r.id)}
                          disabled={processingId === r.id}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminReviews;
