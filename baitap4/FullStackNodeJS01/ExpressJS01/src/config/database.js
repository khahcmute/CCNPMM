// src/config/database.js
require("dotenv").config();
const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
const mongoose = require("mongoose");

// Sequelize ORM cho MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || "fullstack_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "123456",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // tắt log SQL cho gọn
  }
);

// MySQL Connection Pool (nếu bạn còn muốn dùng raw query)
const mysqlConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "fullstack_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
const mysqlPool = mysql.createPool(mysqlConfig);

// MongoDB config
const mongoConfig = {
  uri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/fullstack_products",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
};

let mongoConnection = null;
const connectMongoDB = async () => {
  if (mongoConnection) return mongoConnection;
  mongoConnection = await mongoose.connect(
    mongoConfig.uri,
    mongoConfig.options
  );
  console.log("✅ MongoDB connected successfully for products");
  return mongoConnection;
};

const testMySQLConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connected successfully to MySQL");
    return true;
  } catch (error) {
    console.error("❌ MySQL connection error:", error);
    return false;
  }
};

const initializeDatabases = async () => {
  try {
    await testMySQLConnection();
    await connectMongoDB();
    console.log("🎉 Both databases initialized successfully!");
    return true;
  } catch (error) {
    console.error("💥 Database initialization failed:", error);
    return false;
  }
};

module.exports = {
  sequelize, // 👈 thêm cái này để User.js dùng được
  mysqlPool,
  mongoose,
  connectMongoDB,
  testMySQLConnection,
  initializeDatabases,
};
