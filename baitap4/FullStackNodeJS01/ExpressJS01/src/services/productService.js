// src/services/productService.js
const Product = require("../models/product");
const Category = require("../models/category");

const productService = {
  // Lấy sản phẩm theo danh mục với phân trang và lazy loading
  getProductsByCategory: async (
    categoryId,
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc"
  ) => {
    try {
      const skip = (page - 1) * limit;

      // Xây dựng query filter
      const filter = { status: "active" };
      if (categoryId && categoryId !== "all") {
        filter.category = categoryId;
      }

      // Xây dựng sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Lấy sản phẩm với populate category
      const products = await Product.find(filter)
        .populate("category", "name")
        .populate("createdBy", "email")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Đếm tổng số sản phẩm
      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;

      return {
        success: true,
        data: {
          products,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalProducts,
            hasNextPage,
            limit: parseInt(limit),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi khi lấy danh sách sản phẩm",
        error: error.message,
      };
    }
  },

  // Lấy tất cả danh mục active
  getAllCategories: async () => {
    try {
      const categories = await Category.find({ status: "active" })
        .populate("parentCategory", "name")
        .sort({ name: 1 })
        .lean();

      return {
        success: true,
        data: categories,
      };
    } catch (error) {
      console.error("❌ getAllCategories error:", error);
      return {
        success: false,
        message: "Lỗi khi lấy danh sách danh mục",
        error: error.message,
      };
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (searchTerm, categoryId, page = 1, limit = 12) => {
    try {
      const skip = (page - 1) * limit;

      const filter = {
        status: "active",
        $text: { $search: searchTerm },
      };

      if (categoryId && categoryId !== "all") {
        filter.category = categoryId;
      }

      const products = await Product.find(filter, {
        score: { $meta: "textScore" },
      })
        .populate("category", "name")
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;

      return {
        success: true,
        data: {
          products,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalProducts,
            hasNextPage,
            limit: parseInt(limit),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi khi tìm kiếm sản phẩm",
        error: error.message,
      };
    }
  },

  // Lấy chi tiết sản phẩm
  getProductById: async (productId) => {
    try {
      const product = await Product.findById(productId)
        .populate("category", "name description")
        .populate("createdBy", "email")
        .lean();

      if (!product) {
        return {
          success: false,
          message: "Không tìm thấy sản phẩm",
        };
      }

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi khi lấy thông tin sản phẩm",
        error: error.message,
      };
    }
  },

  // Tạo sản phẩm mới (dành cho admin)
  createProduct: async (productData, userId) => {
    try {
      const newProduct = new Product({
        ...productData,
        createdBy: userId,
      });

      const savedProduct = await newProduct.save();
      const populatedProduct = await Product.findById(savedProduct._id)
        .populate("category", "name")
        .populate("createdBy", "email");

      return {
        success: true,
        data: populatedProduct,
        message: "Tạo sản phẩm thành công",
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi khi tạo sản phẩm",
        error: error.message,
      };
    }
  },

  getAllProducts: async (
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc"
  ) => {
    try {
      const skip = (page - 1) * limit;
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      const products = await Product.find({ status: "active" })
        .populate("category", "name")
        .populate("createdBy", "email")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const totalProducts = await Product.countDocuments({ status: "active" });
      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;

      return {
        success: true,
        data: {
          products,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalProducts,
            hasNextPage,
            limit: parseInt(limit),
          },
        },
      };
    } catch (error) {
      console.error("❌ getAllProducts error:", error); // log chi tiết ra console
      return {
        success: false,
        message: "Lỗi khi lấy danh sách sản phẩm",
        error: error.message, // trả message cụ thể để debug
      };
    }
  },
};

module.exports = productService;
