const express = require("express");
const productController = require("../controllers/productController");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Public routes (no authentication required)
router.get("/categories", productController.getCategories);
router.get("/featured", productController.getFeaturedProducts);
router.get("/search", optionalAuth, productController.searchProducts);
router.get("/suggestions", productController.getSuggestions);
router.get(
  "/category/:categorySlug",
  optionalAuth,
  productController.getProductsByCategory
);
router.get("/", optionalAuth, productController.getProducts);
router.get("/:slug", optionalAuth, productController.getProductBySlug);

module.exports = router;
