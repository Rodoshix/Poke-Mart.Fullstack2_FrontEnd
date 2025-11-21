import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserForm from "@/components/users/UserForm.jsx";
import { createAdminUser, fetchAdminUser, updateAdminUser } from "@/services/adminUserApi.js";

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
