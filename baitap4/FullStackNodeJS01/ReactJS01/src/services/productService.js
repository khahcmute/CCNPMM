// src/services/productService.js - Frontend
import axios from "../util/axiosCustomize";

export const productAPI = {
  // Lấy sản phẩm theo danh mục với lazy loading
  getProductsByCategory: async (
    categoryId = "all",
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc"
  ) => {
    try {
      const res = await axios.get(`/api/products/category/${categoryId}`, {
        params: { page, limit, sortBy, sortOrder },
      });
      return res; // interceptor đã unwrap .data rồi
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      throw error;
    }
  },

  // Lấy tất cả danh mục
  // productService.js
  getAllCategories: async () => {
    try {
      const response = await axios.get("/api/categories"); // axios instance có baseURL
      console.log("Danh mục trả về:", response); // response là object EC, EM, DT
      return response; // trả về nguyên object, không thêm .data
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error.response || error.message);
      return { EC: 1, EM: "Không thể lấy danh mục", DT: [] };
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (
    searchTerm,
    categoryId = "all",
    page = 1,
    limit = 12
  ) => {
    try {
      const response = await axios.get("/api/products/search", {
        params: {
          q: searchTerm,
          category: categoryId,
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm
  getProductById: async (productId) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      throw error;
    }
  },

  // Tạo sản phẩm mới (admin)
  createProduct: async (productData) => {
    try {
      const response = await axios.post("/api/products", productData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      throw error;
    }
  },
};
