import api from "./api";

class ProductService {
  async getProducts(params = {}) {
    const response = await api.get("/products", { params });
    return response.data;
  }

  async searchProducts(params = {}) {
    const response = await api.get("/products/search", { params });
    return response.data;
  }

  async getProductBySlug(slug) {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  }

  async getCategories() {
    const response = await api.get("/products/categories");
    return response.data;
  }

  async getProductsByCategory(categorySlug, params = {}) {
    const response = await api.get(`/products/category/${categorySlug}`, {
      params,
    });
    return response.data;
  }

  async getFeaturedProducts(limit = 10) {
    const response = await api.get("/products/featured", { params: { limit } });
    return response.data;
  }

  async getSuggestions(query, limit = 5) {
    const response = await api.get("/products/suggestions", {
      params: { q: query, limit },
    });
    return response.data;
  }
}

export default new ProductService();
