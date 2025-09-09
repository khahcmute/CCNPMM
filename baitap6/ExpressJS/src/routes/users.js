const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { User } = require("../models");

const router = express.Router();

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.update({
      fullName: fullName || user.fullName,
      phone: phone || user.phone,
      address: address || user.address,
    });

    const updatedUser = await User.findByPk(req.userId, {
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
      },
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
