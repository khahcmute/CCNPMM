const UserService = require("../services/userService");
const { validationResult } = require("express-validator");

class UserController {
  // Register
  static async register(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const result = await UserService.registerUser(req.body);

      const statusCode = result.success ? 201 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error("Register controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await UserService.loginUser(email, password);

      const statusCode = result.success ? 200 : 401;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error("Login controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  }

  // Get Profile
  static async getProfile(req, res) {
    try {
      const result = await UserService.getUserProfile(req.user.userId);

      const statusCode = result.success ? 200 : 404;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error("Get profile controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  }

  // Forgot Password
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await UserService.forgotPassword(email);

      // Always return 200 for security reasons
      return res.status(200).json(result);
    } catch (error) {
      console.error("Forgot password controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  }

  // Reset Password
  static async resetPassword(req, res) {
    try {
      const { resetToken } = req.params;
      const { newPassword } = req.body;

      const result = await UserService.resetPassword(resetToken, newPassword);

      const statusCode = result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error("Reset password controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  }

  // Get All Users (Admin function)
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await UserService.getAllUsers(page, limit);

      const statusCode = result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error("Get all users controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  }
}

module.exports = UserController;
