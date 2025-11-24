import { useEffect, useMemo, useState } from "react";
import {
  fetchAdminBlogs,
  createAdminBlog,
  updateAdminBlog,
  updateAdminBlogStatus,
  deleteAdminBlog,
} from "@/services/adminBlogApi.js";
import LoaderOverlay from "@/components/common/LoaderOverlay.jsx";

const emptyForm = {
  titulo: "",
  descripcion: "",
  contenido: "",
  categoria: "",
  etiquetas: "",
  imagen: "",
  estado: "DRAFT",
};

const statusLabel = (estado) => (estado === "PUBLISHED" ? "Publicado" : "Borrador");

const statusBadgeClass = (estado) =>
  estado === "PUBLISHED" ? "admin-order-badge admin-order-badge--success" : "admin-order-badge admin-order-badge--warning";

const parseEtiquetas = (value = "") =>
  value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const formatDate = (value) => {
  if (!value) return "Reciente";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("es-CL");
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.toLocaleDateString("es-CL")} ${d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
};

const debounce = (fn, delay = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [filters, setFilters] = useState({ estado: "", categoria: "", q: "" });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await fetchAdminBlogs();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const okEstado = !filters.estado || b.estado === filters.estado;
      const okCat = !filters.categoria || b.categoria === filters.categoria;
      const q = (filters.q || "").toLowerCase();
      const okQ = !q || (b.titulo || "").toLowerCase().includes(q) || (b.descripcion || "").toLowerCase().includes(q);
      return okEstado && okCat && okQ;
    });
  }, [blogs, filters]);

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setForm({
      titulo: blog.titulo || "",
      descripcion: blog.descripcion || "",
      contenido: blog.contenido || "",
      categoria: blog.categoria || "",
      etiquetas: (blog.etiquetas || []).join(", "),
      imagen: blog.imagen || "",
      estado: blog.estado || "DRAFT",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Eliminar este blog de forma permanente?");
    if (!ok) return;
    setProcessingId(id);
    try {
      await deleteAdminBlog(id);
      setMessage("Blog eliminado.");
      await load();
    } catch (err) {
      setError(err?.message || "No se pudo eliminar el blog.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusToggle = async (blog) => {
    const nextStatus = blog.estado === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setProcessingId(blog.id);
    try {
      await updateAdminBlogStatus(blog.id, nextStatus);
      setMessage(`Blog ${nextStatus === "PUBLISHED" ? "publicado" : "movido a borrador"}.`);
      await load();
    } catch (err) {
      setError(err?.message || "No se pudo actualizar el estado.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessingId("form");
    setMessage("");
    setError("");
    const payload = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      contenido: form.contenido.trim(),
      categoria: form.categoria.trim(),
      imagen: form.imagen.trim(),
      etiquetas: parseEtiquetas(form.etiquetas),
      estado: form.estado,
    };

    try {
      if (editingId) {
        await updateAdminBlog(editingId, payload);
        setMessage("Blog actualizado.");
      } else {
        await createAdminBlog(payload);
        setMessage("Blog creado.");
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err?.message || "No se pudo guardar el blog.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltersChange = debounce((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, 200);

  const categories = useMemo(() => {
    return Array.from(new Set(blogs.map((b) => b.categoria).filter(Boolean))).sort((a, b) => a.localeCompare(b, "es"));
  }, [blogs]);

  return (
    <section className="admin-paper admin-blogs">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{editingId ? "Editar blog" : "Blogs"}</h1>
        <p className="admin-page-subtitle">
          Crea, publica o despublica entradas del blog. Las entradas eliminadas se quitan de forma permanente.
        </p>
      </div>

      {(message || error) && (
        <div className={`admin-products__alert${error ? " admin-products__alert--error" : ""}`} role={error ? "alert" : "status"}>
          {error || message}
        </div>
      )}

      <div className="admin-blogs__layout">
        <div className="admin-blogs__form-card">
          <h2 className="admin-offers__title">{editingId ? "Editar entrada" : "Nueva entrada"}</h2>
          <p className="admin-offers__subtitle">Completa los datos y publica o guarda como borrador.</p>

          <form className="admin-blogs__form" onSubmit={handleSubmit}>
            <div className="admin-offers__fields">
              <div className="admin-offers__field">
                <label className="admin-offers__label" htmlFor="titulo">Título</label>
                <input
                  id="titulo"
                  name="titulo"
                  className="admin-offers__input"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                  maxLength={180}
                />
              </div>
              <div className="admin-offers__field">
                <label className="admin-offers__label" htmlFor="categoria">Categoría</label>
                <input
                  id="categoria"
                  name="categoria"
                  className="admin-offers__input"
                  value={form.categoria}
                  onChange={handleChange}
                  maxLength={120}
                />
              </div>
              <div className="admin-offers__field">
                <label className="admin-offers__label" htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  name="estado"
                  className="admin-offers__input"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <option value="DRAFT">Borrador</option>
                  <option value="PUBLISHED">Publicado</option>
                </select>
              </div>
              <div className="admin-offers__field">
                <label className="admin-offers__label" htmlFor="imagen">Imagen (URL o /uploads/...)</label>
                <input
                  id="imagen"
                  name="imagen"
                  className="admin-offers__input"
                  value={form.imagen}
                  onChange={handleChange}
                  maxLength={500}
                />
              </div>
              <div className="admin-offers__field">
                <label className="admin-offers__label" htmlFor="etiquetas">Etiquetas (separadas por coma)</label>
                <input
                  id="etiquetas"
                  name="etiquetas"
                  className="admin-offers__input"
                  value={form.etiquetas}
                  onChange={handleChange}
                  maxLength={500}
                />
              </div>
            </div>

            <div className="admin-offers__field">
              <label className="admin-offers__label" htmlFor="descripcion">Resumen</label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="admin-offers__input"
                rows={2}
                value={form.descripcion}
                onChange={handleChange}
                maxLength={480}
                required
              />
            </div>

            <div className="admin-offers__field">
              <label className="admin-offers__label" htmlFor="contenido">Contenido</label>
              <textarea
                id="contenido"
                name="contenido"
                className="admin-offers__input"
                rows={5}
                value={form.contenido}
                onChange={handleChange}
              />
            </div>

            <div className="admin-offers__actions">
              <button
                type="submit"
                className="admin-offers__btn admin-offers__btn--primary"
                disabled={processingId === "form"}
              >
                {editingId ? "Actualizar" : "Crear"} blog
              </button>
              <button
                type="button"
                className="admin-offers__btn admin-offers__btn--ghost"
                onClick={() => { setForm(emptyForm); setEditingId(null); }}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>

        <div className="admin-blogs__list-card">
          <div className="admin-product-filters mb-3">
            <div className="admin-product-filters__group">
              <span className="admin-product-filters__label">Estado</span>
              <select
                className="admin-product-filters__select"
                defaultValue=""
                onChange={(e) => handleFiltersChange("estado", e.target.value)}
              >
                <option value="">Todos</option>
                <option value="PUBLISHED">Publicados</option>
                <option value="DRAFT">Borrador</option>
              </select>
            </div>
            <div className="admin-product-filters__group">
              <span className="admin-product-filters__label">Categoría</span>
              <select
                className="admin-product-filters__select"
                defaultValue=""
                onChange={(e) => handleFiltersChange("categoria", e.target.value)}
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="admin-product-filters__group admin-product-filters__group--grow">
              <span className="admin-product-filters__label">Buscar</span>
              <input
                type="search"
                className="admin-product-filters__input"
                placeholder="Título o resumen"
                onChange={(e) => handleFiltersChange("q", e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <LoaderOverlay text="Cargando blogs..." />
          ) : (
            <div className="admin-product-table admin-review-table admin-blogs__table">
              <table className="admin-table admin-product-table__inner">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Publicado</th>
                    <th>Actualizado</th>
                    <th className="admin-product-table__actions-header">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="admin-table__empty">No hay blogs con esos filtros.</td>
                    </tr>
                  ) : (
                    filteredBlogs.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div className="admin-blog__title">
                            <strong>{b.titulo}</strong>
                            <div className="admin-table__cell--mono">/{b.slug}</div>
                          </div>
                        </td>
                        <td>{b.categoria || "Sin categoría"}</td>
                        <td>
                          <span className={statusBadgeClass(b.estado)}>{statusLabel(b.estado)}</span>
                        </td>
                        <td>{formatDate(b.fechaPublicacion)}</td>
                        <td>{formatDateTime(b.actualizadoEn || b.creadoEn)}</td>
                        <td>
                          <div className="admin-product-table__actions">
                            <button
                              type="button"
                              className="admin-product-table__action"
                              onClick={() => handleEdit(b)}
                              disabled={processingId === b.id}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="admin-product-table__action admin-product-table__action--secondary"
                              onClick={() => handleStatusToggle(b)}
                              disabled={processingId === b.id}
                            >
                              {b.estado === "PUBLISHED" ? "Despublicar" : "Publicar"}
                            </button>
                            <button
                              type="button"
                              className="admin-product-table__action admin-product-table__action--danger"
                              onClick={() => handleDelete(b.id)}
                              disabled={processingId === b.id}
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
        </div>
      </div>
    </section>
  );
};

export default AdminBlogs;
