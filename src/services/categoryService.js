import { getProductCategories } from "@/services/productService.js";

const getAllCategories = () => {
  const categories = getProductCategories();
  return categories.map((name, index) => ({
    id: index + 1,
    nombre: name,
  }));
};

export { getAllCategories };
