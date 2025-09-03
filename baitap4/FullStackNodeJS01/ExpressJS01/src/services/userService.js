const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class UserService {
  static async registerUser(userData) {
    try {
      const { email, password, firstName, lastName, phone } = userData;

      if (!email || !password || !firstName || !lastName) {
        return { success: false, message: "Missing required fields" };
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return { success: false, message: "Email already exists" };
      }

      const user = new User({
        email: email.toLowerCase(),
        password,
        firstName,
        lastName,
        phone,
      });

      await user.save();

      return {
        success: true,
        message: "User registered successfully",
        user: user.toJSON(),
      };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Registration failed" };
    }
  }

  static async loginUser(email, password) {
    try {
      const user = await User.findOne({
        email: email.toLowerCase(),
        isActive: true,
      });
      if (!user)
        return { success: false, message: "Invalid email or password" };

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return { success: false, message: "Invalid email or password" };

      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      return {
        success: true,
        message: "Login successful",
        token,
        user: user.toJSON(),
      };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Login failed" };
    }
  }

  static async getUserProfile(userId) {
    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) return { success: false, message: "User not found" };
    return {
      success: true,
      user: { ...user.toJSON(), fullName: user.getFullName() },
    };
  }

  static async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, count] = await Promise.all([
      User.find()
        .select("-password -resetPasswordToken -resetPasswordExpires")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return {
      success: true,
      data: {
        users: users.map((u) => ({ ...u.toJSON(), fullName: u.getFullName() })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalUsers: count,
          limit,
        },
      },
    };
  }
}

module.exports = UserService;
