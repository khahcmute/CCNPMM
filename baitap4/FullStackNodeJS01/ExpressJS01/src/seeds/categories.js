// src/seeds/categories.js
const Category = require("../models/category");

const seedCategories = async () => {
  const categories = [
    { name: "Điện thoại", description: "Smartphone và phụ kiện" },
    { name: "Laptop", description: "Máy tính xách tay" },
    { name: "Tablet", description: "Máy tính bảng" },
    { name: "Phụ kiện", description: "Phụ kiện công nghệ" },
    { name: "Đồng hồ thông minh", description: "Smartwatch" },
  ];

  for (const categoryData of categories) {
    const existingCategory = await Category.findOne({
      name: categoryData.name,
    });
    if (!existingCategory) {
      const category = new Category({
        ...categoryData,
        createdBy: "USER_ID_HERE", // Thay bằng ID user thực tế
      });
      await category.save();
      console.log(`Created category: ${categoryData.name}`);
    }
  }
};

module.exports = { seedCategories };
