import { Link } from "react-router-dom";
import { resolveImg } from "@/utils/resolveImg.js";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const productImages = import.meta.glob("../../assets/img/tienda/productos/*", {
  eager: true,
  import: "default",
});

const imageByFileName = Object.entries(productImages).reduce((accumulator, [path, src]) => {
  const parts = path.split("/");
  const fileName = parts[parts.length - 1];
  if (fileName && typeof src === "string") {
    accumulator[fileName] = src;
  }
  return accumulator;
}, {});

const resolveProductImage = (imagePath) => {
  if (!imagePath) return null;
  if (/^data:/i.test(imagePath) || /^https?:/i.test(imagePath)) {
    return imagePath;
  }
  const fileName = imagePath.split("/").pop();
  if (fileName && imageByFileName[fileName]) {
    return imageByFileName[fileName];
  }
  return resolveImg(imagePath);
};

const ProductTable = ({ products, onToggleActive, onDelete, processingId }) => (
  <div className="admin-product-table">
    <table className="admin-table admin-product-table__inner">
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Stock</th>
          <th scope="col">Precio</th>
          <th scope="col">Estado</th>
          <th scope="col" className="admin-product-table__actions-header">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan={7} className="admin-table__empty">
              No hay productos para mostrar con los filtros seleccionados.
            </td>
          </tr>
        ) : (
          products.map((product) => {
            const imageSrc = resolveProductImage(product.imagen);
            const isProcessing = processingId === product.id;
            return (
              <tr key={product.id}>
                <td>
                  <div className="admin-product-table__product-cell">
                    {imageSrc ? (
                      <img src={imageSrc} alt={product.nombre} loading="lazy" />
                    ) : (
                      <span className="admin-product-table__placeholder" aria-hidden="true">
                        {String(product.nombre).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="admin-table__cell--mono">{product.id}</td>
                <td>{product.nombre}</td>
                <td>{product.stock}</td>
                <td>{currencyFormatter.format(product.precio)}</td>
                <td>
                  <span className={`badge ${product.active ? "text-bg-success" : "text-bg-secondary"}`}>
                    {product.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <div className="admin-product-table__actions">
                    <Link to={`/admin/productos/${product.id}/editar`} className="admin-product-table__action">
                      Editar
                    </Link>
                    {typeof onToggleActive === "function" && (
                      <button
                        type="button"
                        className="admin-product-table__action"
                        onClick={() => onToggleActive(product.id, !product.active)}
                        disabled={isProcessing}
                      >
                        {product.active ? "Desactivar" : "Activar"}
                      </button>
                    )}
                    {typeof onDelete === "function" && (
                      <button
                        type="button"
                        className="admin-product-table__action admin-product-table__action--danger"
                        onClick={() => onDelete(product.id)}
                        disabled={isProcessing}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

export default ProductTable;
