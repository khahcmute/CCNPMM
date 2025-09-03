const express = require("express");
const { body } = require("express-validator");
const UserController = require("../controllers/userController");
const HomeController = require("../controllers/homeController");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/auth");
const delayMiddleware = require("../middleware/delay");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
];

const resetPasswordValidation = [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Public routes
router.post("/register", registerValidation, UserController.register);
router.post("/login", loginValidation, UserController.login);
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  UserController.forgotPassword
);
router.post(
  "/reset-password/:resetToken",
  resetPasswordValidation,
  UserController.resetPassword
);

// Protected routes
router.get("/profile", authMiddleware, UserController.getProfile);
router.get("/users", authMiddleware, UserController.getAllUsers);
router.get(
  "/home",
  delayMiddleware(500),
  authMiddleware,
  HomeController.getHome
);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Routes cho sản phẩm (public)
router.get(
  "/products/category/:categoryId",
  productController.getProductsByCategory
);
router.get("/products", productController.getAllProducts);
router.get("/products/search", productController.searchProducts);
router.get("/products/:id", productController.getProductById);
router.get("/categories", productController.getAllCategories);

// Routes cho admin (protected)
router.post("/products", authMiddleware, productController.createProduct);

module.exports = router;
