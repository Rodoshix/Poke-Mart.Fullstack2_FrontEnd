import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserForm from "@/components/users/UserForm.jsx";
import { createAdminUser, fetchAdminUser, updateAdminUser, deactivateAdminUser, setAdminUserActive, deleteAdminUser } from "@/services/adminUserApi.js";
import useAuthSession from "@/hooks/useAuthSession.js";

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuthSession();
  const isNew = !id || id === "nuevo";
  const numericId = isNew ? null : Number(id);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew || numericId === null || Number.isNaN(numericId)) {
      setUser(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchAdminUser(numericId)
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isNew, numericId]);

  const initialUser = useMemo(
    () =>
      user ?? {
        id: null,
        username: "",
        password: "",
        role: "cliente",
        nombre: "",
        apellido: "",
        run: "",
        fechaNacimiento: "",
        region: "",
        comuna: "",
        direccion: "",
        email: "",
        telefono: "",
        active: true,
        registeredAt: new Date().toISOString(),
      },
    [user],
  );

  const handleSubmit = async (formData) => {
    try {
      if (isNew) {
        const created = await createAdminUser(formData);
        navigate("/admin/usuarios", {
          replace: true,
          state: { status: "created", userId: created.id },
        });
      } else {
        if (!user) {
          throw new Error("No se encontró el usuario para editar.");
        }
        const updated = await updateAdminUser(user.id, formData);
        navigate("/admin/usuarios", {
          replace: true,
          state: { status: "updated", userId: updated.id },
        });
      }
      setErrorMessage("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar el usuario.";
      setErrorMessage(message);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDeactivate = async () => {
    if (!user?.id) return;
    const ok = window.confirm("Desactivar este usuario? No podr\u00e1 iniciar sesion hasta reactivarlo.");
    if (!ok) return;
    try {
      await deactivateAdminUser(user.id);
      navigate("/admin/usuarios", { replace: true, state: { status: "updated", userId: user.id } });
    } catch (err) {
      setErrorMessage(err?.message || "No se pudo desactivar el usuario.");
    }
  };

  const handleActivate = async () => {
    if (!user?.id) return;
    try {
      await setAdminUserActive(user.id, true);
      navigate("/admin/usuarios", { replace: true, state: { status: "updated", userId: user.id } });
    } catch (err) {
      setErrorMessage(err?.message || "No se pudo reactivar el usuario.");
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;
    const confirmed = window.confirm("¿Eliminar este usuario de forma permanente? Esta acción no se puede deshacer.");
    if (!confirmed) return;
    try {
      await deleteAdminUser(user.id);
      navigate("/admin/usuarios", { replace: true, state: { status: "updated", userId: user.id } });
    } catch (err) {
      setErrorMessage(err?.message || "No se pudo eliminar el usuario.");
    }
  };

  const canDelete =
    !isNew &&
    user &&
    (user.role || "").toLowerCase() !== "admin" &&
    (!profile?.id || Number(profile.id) !== Number(user.id));

  if (loading) {
    return (
      <section className="admin-paper admin-user-edit">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Cargando usuario...</h1>
        </div>
      </section>
    );
  }

  if (!isNew && !user) {
    return (
      <section className="admin-paper admin-user-edit">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Usuario no encontrado</h1>
          <p className="admin-page-subtitle">
            No existe un usuario con el identificador solicitado. Revisa el listado e intenta nuevamente.
          </p>
        </div>
        <Link
          to="/admin/usuarios"
          className="admin-products__action-button admin-products__action-button--primary"
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-paper admin-user-edit">
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          {isNew ? "Agregar usuario" : `Editar usuario #${user?.id ?? ""}`}
        </h1>
        <p className="admin-page-subtitle">
          {isNew
            ? "Registra un nuevo usuario con todos los datos requeridos por el formulario de la tienda."
            : "Actualiza la información del usuario. El identificador se mantiene sin cambios."}
        </p>
      </div>

      {errorMessage && (
        <div className="admin-products__alert admin-products__alert--error" role="alert">
          {errorMessage}
        </div>
      )}

      {!isNew && user && (
        <div className="admin-users__actions">
          <div className="admin-users__status">
            Estado:{" "}
            <span className={`badge ${user.active ? "text-bg-success" : "text-bg-secondary"}`}>
              {user.active ? "Activo" : "Inactivo"}
            </span>
          </div>
          <div className="admin-users__actions-buttons">
            {user.active ? (
              <button
                type="button"
                className="admin-products__action-button admin-products__action-button--danger"
                onClick={handleDeactivate}
              >
                Desactivar
              </button>
            ) : (
              <button
                type="button"
                className="admin-products__action-button admin-products__action-button--primary"
                onClick={handleActivate}
              >
                Reactivar
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                className="admin-products__action-button admin-products__action-button--danger"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      )}

      <UserForm
        initialUser={initialUser}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isNew ? "Crear usuario" : "Guardar cambios"}
        isNew={isNew}
      />
    </section>
  );
};

export default AdminUserEdit;
