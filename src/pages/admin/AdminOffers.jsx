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
  const [categoryFilter, setCategoryFilter] = useState("");
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

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategoryFilter(value);
    setForm((prev) => {
      const currentProduct = (products ?? []).find((p) => String(p.id) === String(prev.productId));
      const stillValid = currentProduct && (!value || currentProduct.categoria === value);
      return stillValid ? prev : { ...prev, productId: "" };
    });
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
  const categories = useMemo(() => {
    const set = new Set();
    (products ?? []).forEach((p) => {
      if (p?.categoria) set.add(p.categoria);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);
  const productOptions = useMemo(() => {
    const base = [...(products ?? [])];
    const filtered = categoryFilter ? base.filter((p) => p?.categoria === categoryFilter) : base;
    return filtered.sort((a, b) => (a?.nombre || "").localeCompare(b?.nombre || "", "es"));
  }, [products, categoryFilter]);

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

      <div className="admin-offers__form-card">
        <div className="admin-offers__section-head">
          <h2 className="admin-offers__title">{form.id ? "Editar oferta" : "Crear oferta"}</h2>
          <p className="admin-offers__subtitle">Selecciona el producto, define el descuento y una fecha de término opcional.</p>
        </div>

        <form className="admin-offers__form" onSubmit={handleSubmit}>
          <div className="admin-offers__fields">
            <label className="admin-offers__field">
              <span className="admin-offers__label">Categoria</span>
              <select
                name="categoria"
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="admin-offers__input"
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-offers__field">
              <span className="admin-offers__label">Producto</span>
              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                className="admin-offers__input"
                required
              >
                <option value="">Selecciona un producto</option>
                {productOptions.map((product) => (
                  <option key={product.id} value={product.id}>
                    #{product.id} - {product.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-offers__field">
              <span className="admin-offers__label">Descuento (%)</span>
              <input
                type="number"
                name="discountPct"
                min="1"
                max="99"
                value={form.discountPct}
                onChange={handleChange}
                className="admin-offers__input"
                placeholder="Ej: 15"
                required
              />
            </label>

            <label className="admin-offers__field">
              <span className="admin-offers__label">Termina (opcional)</span>
              <input
                type="datetime-local"
                name="endsAt"
                value={form.endsAt}
                onChange={handleChange}
                className="admin-offers__input"
              />
              <small className="admin-offers__hint">Formato local: fecha y hora.</small>
            </label>
          </div>

          <div className="admin-offers__actions">
            <button type="submit" className="admin-products__action-button admin-products__action-button--primary" disabled={loading}>
              {form.id ? "Guardar cambios" : "Crear oferta"}
            </button>
            <button type="button" className="admin-products__action-button" onClick={handleClear} disabled={loading}>
              Limpiar
            </button>
            {form.id && (
              <span className="admin-offers__pill">Editando oferta #{form.id}</span>
            )}
          </div>
        </form>
      </div>

      <div className="admin-offers__list-card">
        <div className="admin-offers__section-head">
          <h2 className="admin-offers__title">Listado de ofertas</h2>
          <p className="admin-offers__subtitle">Activa, pausa o elimina promociones vigentes.</p>
        </div>
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
    </section>
  );
};

export default AdminOffers;
