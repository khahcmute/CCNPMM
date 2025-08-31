const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");

class UserService {
  // Register user
  static async registerUser(userData) {
    try {
      const { email, password, firstName, lastName, phone } = userData;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return {
          success: false,
          message:
            "Please provide all required fields: email, password, firstName, lastName",
        };
      }

      // Check if user exists
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return {
          success: false,
          message: "An account with this email already exists",
        };
      }

      // Create user
      const user = await User.create({
        email: email.toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
      });

      return {
        success: true,
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          fullName: user.getFullName(),
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message:
          error.name === "SequelizeValidationError"
            ? error.errors[0].message
            : "Registration failed. Please try again.",
      };
    }
  }

  // Login user
  static async loginUser(email, password) {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: "Please provide email and password",
        };
      }

      const user = await User.findOne({
        where: {
          email: email.toLowerCase(),
          isActive: true,
        },
      });

      if (!user) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      return {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          fullName: user.getFullName(),
          lastLogin: user.lastLogin,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }
  }

  // Get user profile
  static async getUserProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: {
          exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
        },
      });

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        user: {
          ...user.toJSON(),
          fullName: user.getFullName(),
        },
      };
    } catch (error) {
      console.error("Get profile error:", error);
      return {
        success: false,
        message: "Failed to get user profile",
      };
    }
  }

  // Forgot Password
  static async forgotPassword(email) {
    try {
      if (!email) {
        return {
          success: false,
          message: "Please provide an email address",
        };
      }

      const user = await User.findOne({
        where: {
          email: email.toLowerCase(),
          isActive: true,
        },
      });

      if (!user) {
        // Don't reveal if email exists or not for security
        return {
          success: true,
          message:
            "If an account with this email exists, you will receive a password reset link.",
        };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update user with reset token
      await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires,
      });

      // In production, send email here
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      console.log(`Password Reset URL: ${resetUrl}`); // For development only

      return {
        success: true,
        message:
          "If an account with this email exists, you will receive a password reset link.",
        // Remove these in production
        ...(process.env.NODE_ENV === "development" && {
          resetToken,
          resetUrl,
        }),
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        message: "Failed to process password reset request",
      };
    }
  }

  // Reset Password
  static async resetPassword(resetToken, newPassword) {
    try {
      if (!resetToken || !newPassword) {
        return {
          success: false,
          message: "Please provide reset token and new password",
        };
      }

      if (newPassword.length < 6) {
        return {
          success: false,
          message: "Password must be at least 6 characters long",
        };
      }

      const user = await User.findOne({
        where: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: {
            [Op.gt]: new Date(),
          },
          isActive: true,
        },
      });

      if (!user) {
        return {
          success: false,
          message: "Invalid or expired reset token",
        };
      }

      // Update password and clear reset token
      await user.update({
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      return {
        success: true,
        message:
          "Password reset successful. You can now login with your new password.",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: "Failed to reset password. Please try again.",
      };
    }
  }

  // Get all users (admin function)
  static async getAllUsers(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await User.findAndCountAll({
        attributes: {
          exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      return {
        success: true,
        data: {
          users: rows.map((user) => ({
            ...user.toJSON(),
            fullName: user.getFullName(),
          })),
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalUsers: count,
            limit: parseInt(limit),
          },
        },
      };
    } catch (error) {
      console.error("Get all users error:", error);
      return {
        success: false,
        message: "Failed to get users",
      };
    }
  }
}

module.exports = UserService;
