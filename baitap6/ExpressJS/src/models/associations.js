const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");

// Category - Product relationship
Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

module.exports = {
  User,
  Category,
  Product,
};

module.exports = {
  User,
  Category,
  Product,
};
