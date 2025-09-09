const sequelize = require("../config/database");
const associations = require("./associations");

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");

    // Insert sample data
    await insertSampleData();
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

const insertSampleData = async () => {
  const { Category, Product } = associations;

  try {
    // Insert categories
    const categories = await Category.bulkCreate(
      [
        {
          name: "Electronics",
          slug: "electronics",
          description: "Electronic devices and gadgets",
        },
        {
          name: "Clothing",
          slug: "clothing",
          description: "Fashion and apparel",
        },
        { name: "Books", slug: "books", description: "Books and literature" },
        {
          name: "Home & Garden",
          slug: "home-garden",
          description: "Home improvement and garden supplies",
        },
        {
          name: "Sports",
          slug: "sports",
          description: "Sports and outdoor equipment",
        },
      ],
      { ignoreDuplicates: true }
    );

    // Insert products
    const products = [
      {
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        description: "Latest iPhone with advanced features",
        shortDescription: "Premium smartphone with excellent camera",
        price: 999.99,
        salePrice: 899.99,
        sku: "IP15PRO001",
        stock: 50,
        categoryId: 1,
        isFeatured: true,
        tags: ["smartphone", "apple", "premium"],
      },
      {
        name: "Samsung Galaxy S24",
        slug: "samsung-galaxy-s24",
        description: "Powerful Android smartphone",
        shortDescription: "Latest Samsung flagship phone",
        price: 849.99,
        sku: "SGS24001",
        stock: 30,
        categoryId: 1,
        tags: ["smartphone", "samsung", "android"],
      },
      {
        name: "Nike Air Max",
        slug: "nike-air-max",
        description: "Comfortable running shoes",
        shortDescription: "Premium running shoes for athletes",
        price: 129.99,
        salePrice: 99.99,
        sku: "NAM001",
        stock: 100,
        categoryId: 2,
        tags: ["shoes", "nike", "running"],
      },
    ];

    await Product.bulkCreate(products, { ignoreDuplicates: true });

    console.log("Sample data inserted successfully");
  } catch (error) {
    console.log("Sample data already exists or error:", error.message);
  }
};
module.exports = {
  sequelize,
  syncDatabase,
  ...associations,
};
