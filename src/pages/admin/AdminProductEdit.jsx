import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "@/components/products/ProductForm.jsx";
import { fetchAdminProduct, updateAdminProduct, fetchAdminProducts } from "@/services/adminProductApi.js";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);
  const [errorMessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState(null);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchAdminProduct(numericId);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setProduct(null);
      }
      try {
        const list = await fetchAdminProducts();
        if (!cancelled) setProductsList(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setProductsList([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  const categories = useMemo(() => {
    const set = new Set(
      (productsList ?? [])
        .map((item) => (item?.categoria ?? "").toString().trim())
        .filter(Boolean),
    );
    if (product?.categoria) {
      set.add(product.categoria.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [productsList, product?.categoria]);

  const handleSubmit = async (updatedProduct) => {
    try {
      await updateAdminProduct(product.id, updatedProduct);
      await fetchAdminProducts();
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
