const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");
const emailService = require("./emailService");

class AuthService {
  generateTokens(userId) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  async register(userData) {
    const existingUser = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { email: userData.email },
          { username: userData.username },
        ],
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create(userData);
    const tokens = this.generateTokens(user.id);

    // Send welcome email
    await emailService.sendWelcomeEmail(
      user.email,
      user.fullName || user.username
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      tokens,
    };
  }

  async login(email, password) {
    const user = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [{ email: email }, { username: email }],
        isActive: true,
      },
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }

    const tokens = this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.userId);

      if (!user || !user.isActive) {
        throw new Error("User not found");
      }

      const tokens = this.generateTokens(user.id);
      return tokens;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email, isActive: true } });

    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires,
    });

    await emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: "Password reset email sent" };
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [require("sequelize").Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { message: "Password reset successful" };
  }
}

module.exports = new AuthService();
