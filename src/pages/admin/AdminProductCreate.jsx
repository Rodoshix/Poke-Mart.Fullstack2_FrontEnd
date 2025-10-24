import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "@/components/products/ProductForm.jsx";
import { createProduct, getNextProductId } from "@/services/productService.js";
import useProductsData from "@/hooks/useProductsData.js";

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const products = useProductsData();

  const nextId = useMemo(() => getNextProductId(), []);

  const initialProduct = useMemo(
    () => ({
      id: nextId,
      nombre: "",
      categoria: "",
      precio: "",
      stock: "",
      imagen: "",
      descripcion: "",
    }),
    [nextId],
  );

  const categories = useMemo(() => {
    const set = new Set(
      (products ?? [])
        .map((product) => (product?.categoria ?? "").toString().trim())
        .filter(Boolean),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  const handleSubmit = async (payload) => {
    try {
      const created = createProduct(payload);
      setErrorMessage("");
      navigate("/admin/productos", {
        replace: true,
        state: { status: "created", productId: created.id },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear el producto";
      setErrorMessage(message);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <section className="admin-paper admin-product-create">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Agregar nuevo producto</h1>
        <p className="admin-page-subtitle">
          Completa la información para publicar un nuevo producto en la tienda. El identificador se asigna
          automáticamente con el siguiente correlativo disponible.
        </p>
      </div>

      {errorMessage && (
        <div className="admin-products__alert admin-products__alert--error" role="alert">
          {errorMessage}
        </div>
      )}

      <ProductForm
        initialProduct={initialProduct}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Crear producto"
        categories={categories}
      />
    </section>
  );
};

export default AdminProductCreate;
