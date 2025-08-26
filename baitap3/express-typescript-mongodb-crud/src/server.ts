import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import connectDB from "./config/database";
import webRoutes from "./routes/web";

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", webRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

// 404 handler
app.use("*", (req: express.Request, res: express.Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
