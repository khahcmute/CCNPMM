const { Product, Category } = require("../models");
const searchService = require("../services/searchService");
const { Op } = require("sequelize");

class ProductController {
  // Get all products with lazy loading support
  async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        categoryId,
        minPrice,
        maxPrice,
        sortBy = "newest",
        onSale,
        featured,
        inStock,
        minRating,
      } = req.query;

      const offset = (page - 1) * parseInt(limit);
      const where = { isActive: true };
      let order = [];

      // Category filter
      if (categoryId) {
        where.categoryId = categoryId;
      }

      // Price filters
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
      }

      // Sale filter
      if (onSale === "true") {
        where.salePrice = { [Op.not]: null };
      }

      // Featured filter
      if (featured === "true") {
        where.isFeatured = true;
      }

      // In stock filter
      if (inStock === "true") {
        where.stock = { [Op.gt]: 0 };
      }

      // Rating filter
      if (minRating) {
        where.rating = { [Op.gte]: parseFloat(minRating) };
      }

      // Sorting
      switch (sortBy) {
        case "price_asc":
          order = [["price", "ASC"]];
          break;
        case "price_desc":
          order = [["price", "DESC"]];
          break;
        case "rating":
          order = [["rating", "DESC"]];
          break;
        case "views":
          order = [["views", "DESC"]];
          break;
        case "name":
          order = [["name", "ASC"]];
          break;
        case "newest":
        default:
          order = [["createdAt", "DESC"]];
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "slug"],
          },
        ],
        order,
        limit: parseInt(limit),
        offset,
        distinct: true,
      });

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalItems: count,
            itemsPerPage: parseInt(limit),
            hasNext: page * parseInt(limit) < count,
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Search products with Elasticsearch fuzzy search
  async searchProducts(req, res) {
    try {
      const {
        q: query,
        page = 1,
        limit = 20,
        categoryId,
        minPrice,
        maxPrice,
        sortBy,
        onSale,
        featured,
        inStock,
        minRating,
      } = req.query;

      if (!query) {
        return this.getProducts(req, res);
      }

      const filters = {
        categoryId,
        minPrice,
        maxPrice,
        sortBy,
        onSale: onSale === "true",
        featured: featured === "true",
        inStock: inStock === "true",
        minRating,
      };

      const result = await searchService.fuzzySearch(
        query,
        filters,
        parseInt(page),
        parseInt(limit)
      );

      // Get full product details from database
      const productIds = result.products.map((p) => p.id);
      const fullProducts = await Product.findAll({
        where: { id: { [Op.in]: productIds } },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "slug"],
          },
        ],
      });

      // Maintain search result order and add highlights
      const orderedProducts = result.products
        .map((searchResult) => {
          const product = fullProducts.find((p) => p.id === searchResult.id);
          return {
            ...product?.toJSON(),
            searchScore: searchResult.score,
            highlights: searchResult.highlight,
          };
        })
        .filter(Boolean);

      res.json({
        success: true,
        data: {
          products: orderedProducts,
          pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalItems: result.total,
            itemsPerPage: parseInt(limit),
            hasNext: result.page < result.totalPages,
            hasPrev: result.page > 1,
          },
          searchInfo: {
            query,
            total: result.total,
            searchTime: Date.now(),
          },
        },
      });
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to database search
      return this.fallbackSearch(req, res);
    }
  }

  // Fallback search using database LIKE queries
  async fallbackSearch(req, res) {
    try {
      const {
        q: query,
        page = 1,
        limit = 20,
        categoryId,
        minPrice,
        maxPrice,
        sortBy = "newest",
      } = req.query;

      const offset = (page - 1) * parseInt(limit);
      const where = { isActive: true };

      if (query) {
        where[Op.or] = [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          { shortDescription: { [Op.like]: `%${query}%` } },
        ];
      }

      if (categoryId) where.categoryId = categoryId;
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
      }

      let order = [["createdAt", "DESC"]];
      if (sortBy === "price_asc") order = [["price", "ASC"]];
      else if (sortBy === "price_desc") order = [["price", "DESC"]];
      else if (sortBy === "rating") order = [["rating", "DESC"]];

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "slug"],
          },
        ],
        order,
        limit: parseInt(limit),
        offset,
        distinct: true,
      });

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalItems: count,
            itemsPerPage: parseInt(limit),
            hasNext: page * parseInt(limit) < count,
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get search suggestions
  async getSuggestions(req, res) {
    try {
      const { q: query, limit = 5 } = req.query;

      if (!query || query.length < 2) {
        return res.json({
          success: true,
          data: { suggestions: [] },
        });
      }

      const suggestions = await searchService.getSuggestions(
        query,
        parseInt(limit)
      );

      res.json({
        success: true,
        data: { suggestions },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get single product by slug
  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;

      const product = await Product.findOne({
        where: { slug, isActive: true },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "slug"],
          },
        ],
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Increment views
      await product.increment("views");

      res.json({
        success: true,
        data: { product },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get categories
  async getCategories(req, res) {
    try {
      const categories = await Category.findAll({
        where: { isActive: true },
        attributes: ["id", "name", "slug", "description", "image"],
        include: [
          {
            model: Product,
            as: "products",
            attributes: ["id"],
            where: { isActive: true },
            required: false,
          },
        ],
        order: [
          ["sortOrder", "ASC"],
          ["name", "ASC"],
        ],
      });

      // Add product count to each category
      const categoriesWithCount = categories.map((category) => ({
        ...category.toJSON(),
        productCount: category.products ? category.products.length : 0,
        products: undefined, // Remove products array from response
      }));

      res.json({
        success: true,
        data: { categories: categoriesWithCount },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const { categorySlug } = req.params;
      const {
        page = 1,
        limit = 20,
        sortBy = "newest",
        minPrice,
        maxPrice,
      } = req.query;

      const category = await Category.findOne({
        where: { slug: categorySlug, isActive: true },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Use the getProducts method with categoryId
      req.query.categoryId = category.id;
      return this.getProducts(req, res);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const { limit = 10 } = req.query;

      const products = await Product.findAll({
        where: {
          isActive: true,
          isFeatured: true,
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "slug"],
          },
        ],
        order: [
          ["views", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: parseInt(limit),
      });

      res.json({
        success: true,
        data: { products },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProductController();
