const express = require("express");
const cors = require("cors");
const { initializeDatabases } = require("./config/database"); // 👈 sửa ở đây
const seedRoutes = require("./routes/seed");
require("dotenv").config();

// Import routes
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/seed", seedRoutes);
// Routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "FullStack API with MySQL + MongoDB" });
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabases(); // 👈 sửa ở đây
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
