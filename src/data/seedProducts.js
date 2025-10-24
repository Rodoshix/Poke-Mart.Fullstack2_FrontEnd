import catalogoProductos from "@/data/productos.json";

const CAPACITY_BUFFER = 80;

const seedProducts = catalogoProductos.map((producto) => {
  const stock = Number(producto.stock) || 0;
  return {
    id: producto.id,
    name: producto.nombre,
    stock,
    capacity: stock + CAPACITY_BUFFER,
    category: producto.categoria ?? "Sin categoría",
    price: Number(producto.precio) || 0,
  };
});

const totalAvailableStock = seedProducts.reduce((acc, product) => acc + product.stock, 0);
const totalInventoryCapacity = seedProducts.reduce((acc, product) => acc + product.capacity, 0);

export { seedProducts, totalAvailableStock, totalInventoryCapacity };
