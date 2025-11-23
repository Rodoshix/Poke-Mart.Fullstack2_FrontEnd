import { useEffect, useMemo, useState } from "react";
import { fetchAdminOffers, createAdminOffer, updateAdminOffer, setAdminOfferActive, deleteAdminOffer } from "@/services/adminOfferApi.js";
import { fetchAdminProducts } from "@/services/adminProductApi.js";

const formatDateTime = (value) => {
  if (!value) return "";
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleString("es-CL");
  } catch {
    return value;
  }
};

const toInputDateTime = (value) => {
  if (!value) return "";
  return value.slice(0, 16);
};

const emptyForm = {
  id: null,
  productId: "",
  discountPct: "",
  endsAt: "",
  active: true,
};

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [offersData, productsData] = await Promise.all([fetchAdminOffers(), fetchAdminProducts()]);
        setOffers(Array.isArray(offersData) ? offersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        setError(err?.message || "No se pudieron cargar las ofertas.");
      }
    };
    load();
  }, []);

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      if (!form.productId || !form.discountPct) {
        throw new Error("Producto y descuento son obligatorios.");
      }
      if (form.id) {
        const updated = await updateAdminOffer(form.id, form);
        setMessage(`Oferta actualizada para ${updated.productName || "producto"}.`);
      } else {
        const created = await createAdminOffer(form);
        setMessage(`Oferta creada para ${created.productName || "producto"}.`);
      }
      const data = await fetchAdminOffers();
      setOffers(Array.isArray(data) ? data : []);
      setForm(emptyForm);
    } catch (err) {
      setError(err?.message || "No se pudo guardar la oferta.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    resetFeedback();
    setForm({
      id: offer.id,
      productId: offer.productId ?? "",
      discountPct: offer.discountPct ?? "",
      endsAt: toInputDateTime(offer.endsAt),
      active: offer.active,
    });
  };

  const handleClear = () => {
    resetFeedback();
    setForm(emptyForm);
  };

  const handleToggleActive = async (offer) => {
    resetFeedback();
    setProcessingId(offer.id);
    try {
      await setAdminOfferActive(offer.id, !offer.active);
      const data = await fetchAdminOffers();
      setOffers(Array.isArray(data) ? data : []);
      setMessage(`Oferta ${offer.active ? "desactivada" : "activada"}.`);
    } catch (err) {
      setError(err?.message || "No se pudo actualizar el estado de la oferta.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (offer) => {
    resetFeedback();
    const confirmed = window.confirm("Eliminar esta oferta de forma permanente?");
    if (!confirmed) return;
    setProcessingId(offer.id);
    try {
      await deleteAdminOffer(offer.id, true);
      const data = await fetchAdminOffers();
      setOffers(Array.isArray(data) ? data : []);
      setMessage("Oferta eliminada.");
      if (form.id === offer.id) {
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err?.message || "No se pudo eliminar la oferta.");
    } finally {
      setProcessingId(null);
    }
  };

  const offerRows = useMemo(() => offers ?? [], [offers]);

  return (
    <section className="admin-paper admin-offers">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Ofertas</h1>
        <p className="admin-page-subtitle">Crea, edita y apaga ofertas sobre productos del catalogo.</p>
      </div>

      {(message || error) && (
        <div className={`admin-products__alert${error ? " admin-products__alert--error" : ""}`} role={error ? "alert" : "status"}>
          {error || message}
        </div>
      )}

      <div className="admin-grid">
        <div className="admin-card">
          <h2 className="admin-card__title">{form.id ? "Editar oferta" : "Crear oferta"}</h2>
          <p className="admin-card__subtitle">Selecciona el producto y define el descuento.</p>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="admin-form__label">
              Producto
              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                className="admin-form__input"
                required
              >
                <option value="">Selecciona un producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    #{product.id} - {product.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-form__label">
              Descuento (%)
              <input
                type="number"
                name="discountPct"
                min="1"
                max="99"
                value={form.discountPct}
                onChange={handleChange}
                className="admin-form__input"
                placeholder="Ej: 15"
                required
              />
            </label>

            <label className="admin-form__label">
              Termina (opcional)
              <input
                type="datetime-local"
                name="endsAt"
                value={form.endsAt}
                onChange={handleChange}
                className="admin-form__input"
              />
            </label>

            <div className="admin-form__actions">
              <button type="submit" className="admin-products__action-button admin-products__action-button--primary" disabled={loading}>
                {form.id ? "Guardar cambios" : "Crear oferta"}
              </button>
              <button type="button" className="admin-products__action-button" onClick={handleClear} disabled={loading}>
                Limpiar
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <h2 className="admin-card__title">Listado de ofertas</h2>
          <p className="admin-card__subtitle">Activa o edita las promociones vigentes.</p>
          <div className="admin-product-table">
            <table className="admin-table admin-product-table__inner">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Descuento</th>
                  <th>Termina</th>
                  <th>Estado</th>
                  <th className="admin-product-table__actions-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {offerRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-table__empty">
                      No hay ofertas configuradas.
                    </td>
                  </tr>
                ) : (
                  offerRows.map((offer) => {
                    const status = offer.active ? (offer.expired ? "Expirada" : "Activa") : "Inactiva";
                    return (
                      <tr key={offer.id}>
                        <td className="admin-table__cell--mono">{offer.id}</td>
                        <td>
                          <div className="admin-offers__product">
                            <span className="admin-table__cell--mono">#{offer.productId}</span> {offer.productName}
                          </div>
                        </td>
                        <td>{offer.discountPct}%</td>
                        <td>{offer.endsAt ? formatDateTime(offer.endsAt) : "Sin fecha"}</td>
                        <td>
                          <span className={`badge ${offer.active ? "text-bg-success" : "text-bg-secondary"}`}>{status}</span>
                        </td>
                        <td>
                          <div className="admin-product-table__actions">
                            <button
                              type="button"
                              className="admin-product-table__action"
                              onClick={() => handleEdit(offer)}
                              disabled={processingId === offer.id}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="admin-product-table__action"
                              onClick={() => handleToggleActive(offer)}
                              disabled={processingId === offer.id}
                            >
                              {offer.active ? "Desactivar" : "Activar"}
                            </button>
                            <button
                              type="button"
                              className="admin-product-table__action admin-product-table__action--danger"
                              onClick={() => handleDelete(offer)}
                              disabled={processingId === offer.id}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminOffers;
