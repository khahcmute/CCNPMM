const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.post("/register", generalLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/refresh-token", generalLimiter, authController.refreshToken);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
