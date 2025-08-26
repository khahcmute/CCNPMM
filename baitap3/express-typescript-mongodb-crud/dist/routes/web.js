"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homeController_1 = __importDefault(require("../controllers/homeController"));
const router = express_1.default.Router();
// Home routes
router.get("/", homeController_1.default.getHomePage);
router.get("/crud", homeController_1.default.displayGetCRUD);
router.get("/edit-crud", homeController_1.default.getEditCRUD);
// API routes - SỬA LẠI METHOD
router.post("/post-crud", homeController_1.default.postCRUD);
router.post("/put-crud", homeController_1.default.putCRUD); // Đổi từ PUT thành POST
router.get("/delete-crud", homeController_1.default.deleteCRUD); // Giữ GET cho delete
exports.default = router;
