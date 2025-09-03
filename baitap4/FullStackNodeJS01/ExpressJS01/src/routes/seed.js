const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Product = require("../models/product");
const User = require("../models/user");

// API seed dữ liệu mẫu
router.post("/", async (req, res) => {
  try {
    // 🟢 Tạo user admin giả (nếu chưa có)
    let admin = await User.findOne({ email: "admin@example.com" });
    if (!admin) {
      admin = new User({
        email: "admin@example.com",
        password: "123456", // nhớ hash nếu dùng bcrypt
        role: "admin",
      });
      await admin.save();
    }

    // 🟢 Tạo vài danh mục (có createdBy)
    const categoriesData = [
      { name: "Giày Nike", status: "active", createdBy: admin._id },
      { name: "Giày Adidas", status: "active", createdBy: admin._id },
      { name: "Giày Puma", status: "active", createdBy: admin._id },
    ];

    const categories = await Category.insertMany(categoriesData);

    // 🟢 Tạo vài sản phẩm
    const productsData = [
      {
        name: "Nike Air Zoom Pegasus 40",
        description: "Giày chạy bộ bền nhẹ",
        price: 2800000,
        status: "active",
        category: categories[0]._id,
        createdBy: admin._id,
      },
      {
        name: "Adidas Ultraboost 22",
        description: "Đệm êm ái cho dân chạy",
        price: 3500000,
        status: "active",
        category: categories[1]._id,
        createdBy: admin._id,
      },
      {
        name: "Puma RS-X",
        description: "Phong cách retro cá tính",
        price: 2600000,
        status: "active",
        category: categories[2]._id,
        createdBy: admin._id,
      },
    ];

    await Product.insertMany(productsData);

    return res.json({
      EC: 0,
      EM: "Seed dữ liệu thành công",
      DT: {
        categories,
        products: productsData,
      },
    });
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    return res.status(500).json({
      EC: 2,
      EM: "Lỗi khi seed dữ liệu",
      DT: error.message,
    });
  }
});

module.exports = router;
