const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "fullstack_db",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully");

    // Sync models với database (tạo bảng nếu chưa có)
    await sequelize.sync({
      alter: process.env.NODE_ENV === "development",
      force: false, // Đặt true nếu muốn xóa và tạo lại bảng
    });
    console.log("✅ Database synced successfully");
  } catch (error) {
    console.error("❌ Unable to connect to MySQL:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
