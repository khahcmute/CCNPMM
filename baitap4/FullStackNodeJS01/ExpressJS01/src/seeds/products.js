// src/seeds/products.js
const Product = require("../models/product");
const Category = require("../models/category");

const seedProducts = async () => {
  const categories = await Category.find();
  if (categories.length === 0) {
    console.log("No categories found. Please seed categories first.");
    return;
  }

  const sampleProducts = [
    {
      name: "iPhone 15 Pro Max",
      description: "Điện thoại thông minh cao cấp từ Apple",
      price: 29990000,
      category: categories[0]._id, // Điện thoại
      images: ["https://example.com/iphone15.jpg"],
      stock: 50,
    },
    {
      name: "MacBook Pro M3",
      description: "Laptop chuyên nghiệp cho developer",
      price: 49990000,
      category: categories[1]._id, // Laptop
      images: ["https://example.com/macbook.jpg"],
      stock: 30,
    },
    // Thêm nhiều sản phẩm khác...
  ];

  for (const productData of sampleProducts) {
    const existingProduct = await Product.findOne({ name: productData.name });
    if (!existingProduct) {
      const product = new Product({
        ...productData,
        createdBy: "USER_ID_HERE", // Thay bằng ID user thực tế
      });
      await product.save();
      console.log(`Created product: ${productData.name}`);
    }
  }
};

module.exports = { seedProducts };
