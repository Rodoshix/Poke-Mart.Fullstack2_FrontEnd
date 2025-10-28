import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "@/components/products/ProductForm.jsx";
import { getProductById, updateProduct } from "@/services/productService.js";
import useProductsData from "@/hooks/useProductsData.js";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);
  const [errorMessage, setErrorMessage] = useState("");
  const products = useProductsData();

  const product = useMemo(() => getProductById(numericId), [numericId]);
  const categories = useMemo(() => {
    const set = new Set(
      (products ?? [])
        .map((item) => (item?.categoria ?? "").toString().trim())
        .filter(Boolean),
    );
    if (product?.categoria) {
      set.add(product.categoria.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [products, product?.categoria]);

  const handleSubmit = async (updatedProduct) => {
    try {
      await updateProduct(product.id, updatedProduct);
      setErrorMessage("");
      navigate("/admin/productos", {
        replace: true,
        state: { status: "updated", productId: updatedProduct.id },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar el producto";
      setErrorMessage(message);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!product) {
    return (
      <section className="admin-paper admin-product-edit">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Producto no encontrado</h1>
          <p className="admin-page-subtitle">
            No existe un producto con el identificador solicitado. Revisa el listado e intenta nuevamente.
          </p>
        </div>
        <Link to="/admin/productos" className="admin-products__action-button admin-products__action-button--primary">
          Volver al listado
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-paper admin-product-edit">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Editar producto #{product.id}</h1>
        <p className="admin-page-subtitle">
          Ajusta la información comercial del producto. El identificador es único y no se puede modificar.
        </p>
      </div>

      {errorMessage && (
        <div className="admin-products__alert admin-products__alert--error" role="alert">
          {errorMessage}
        </div>
      )}

      <ProductForm
        initialProduct={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Guardar cambios"
        categories={categories}
      />
    </section>
  );
};

export default AdminProductEdit;
