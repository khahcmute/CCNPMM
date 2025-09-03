// src/controllers/productController.js
const productService = require("../services/productService");

const productController = {
  // GET /api/products/category/:categoryId?page=1&limit=12&sortBy=createdAt&sortOrder=desc
  getProductsByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const {
        page = 1,
        limit = 12,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await productService.getProductsByCategory(
        categoryId,
        parseInt(page),
        parseInt(limit),
        sortBy,
        sortOrder
      );

      if (result.success) {
        return res.status(200).json({
          EC: 0,
          EM: "Lấy danh sách sản phẩm thành công",
          DT: result.data,
        });
      } else {
        return res.status(400).json({
          EC: 1,
          EM: result.message,
          DT: null,
        });
      }
    } catch (error) {
      return res.status(500).json({
        EC: 2,
        EM: "Lỗi server",
        DT: null,
      });
    }
  },

  // GET /api/categories
  getAllCategories: async (req, res) => {
    try {
      const result = await productService.getAllCategories();

      if (result.success) {
        return res.status(200).json({
          EC: 0,
          EM: "Lấy danh sách danh mục thành công",
          DT: result.data,
        });
      } else {
        return res.status(400).json({
          EC: 1,
          EM: result.message,
          DT: null,
        });
      }
    } catch (error) {
      return res.status(500).json({
        EC: 2,
        EM: "Lỗi server",
        DT: null,
      });
    }
  },

  // GET /api/products/search?q=keyword&category=categoryId&page=1&limit=12
  searchProducts: async (req, res) => {
    try {
      const {
        q: searchTerm,
        category: categoryId,
        page = 1,
        limit = 12,
      } = req.query;

      if (!searchTerm || searchTerm.trim() === "") {
        return res.status(400).json({
          EC: 1,
          EM: "Từ khóa tìm kiếm không được để trống",
          DT: null,
        });
      }

      const result = await productService.searchProducts(
        searchTerm.trim(),
        categoryId,
        parseInt(page),
        parseInt(limit)
      );

      if (result.success) {
        return res.status(200).json({
          EC: 0,
          EM: "Tìm kiếm sản phẩm thành công",
          DT: result.data,
        });
      } else {
        return res.status(400).json({
          EC: 1,
          EM: result.message,
          DT: null,
        });
      }
    } catch (error) {
      return res.status(500).json({
        EC: 2,
        EM: "Lỗi server",
        DT: null,
      });
    }
  },

  // GET /api/products/:id
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await productService.getProductById(id);

      if (result.success) {
        return res.status(200).json({
          EC: 0,
          EM: "Lấy thông tin sản phẩm thành công",
          DT: result.data,
        });
      } else {
        return res.status(404).json({
          EC: 1,
          EM: result.message,
          DT: null,
        });
      }
    } catch (error) {
      return res.status(500).json({
        EC: 2,
        EM: "Lỗi server",
        DT: null,
      });
    }
  },

  // POST /api/products (cần authentication)
  createProduct: async (req, res) => {
    try {
      const productData = req.body;
      const userId = req.user.id; // Từ middleware auth

      const result = await productService.createProduct(productData, userId);

      if (result.success) {
        return res.status(201).json({
          EC: 0,
          EM: result.message,
          DT: result.data,
        });
      } else {
        return res.status(400).json({
          EC: 1,
          EM: result.message,
          DT: null,
        });
      }
    } catch (error) {
      return res.status(500).json({
        EC: 2,
        EM: "Lỗi server",
        DT: null,
      });
    }
  },

  // GET /api/products
  getAllProducts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const result = await productService.getAllProducts(
        parseInt(page),
        parseInt(limit),
        sortBy,
        sortOrder
      );

      if (result.success) {
        return res.status(200).json({
          EC: 0,
          EM: "Lấy danh sách sản phẩm thành công",
          DT: result.data,
        });
      } else {
        return res.status(400).json({
          EC: 1,
          EM: result.message,
          DT: null,
        });
      }
    } catch (error) {
      return res.status(500).json({
        EC: 2,
        EM: "Lỗi server",
        DT: null,
      });
    }
  },
};

module.exports = productController;
