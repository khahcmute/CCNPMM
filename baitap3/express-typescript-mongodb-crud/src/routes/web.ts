import express from "express";
import HomeController from "../controllers/homeController";

const router = express.Router();

// Home routes
router.get("/", HomeController.getHomePage);
router.get("/crud", HomeController.displayGetCRUD);
router.get("/edit-crud", HomeController.getEditCRUD);

// API routes - SỬA LẠI METHOD
router.post("/post-crud", HomeController.postCRUD);
router.post("/put-crud", HomeController.putCRUD); // Đổi từ PUT thành POST
router.get("/delete-crud", HomeController.deleteCRUD); // Giữ GET cho delete

export default router;
