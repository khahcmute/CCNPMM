"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const CRUDService_1 = __importDefault(require("../services/CRUDService"));
class HomeController {
}
_a = HomeController;
// Render home page
HomeController.getHomePage = (req, res) => {
    console.log("Accessing home page");
    console.log("Views directory:", res.app.get("views"));
    try {
        res.render("crud");
    }
    catch (error) {
        console.error("Error rendering home page:", error);
        res.status(500).send("Error rendering page");
    }
};
// Create new user
HomeController.postCRUD = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        if (!firstName || !lastName || !email) {
            res.render("crud", {
                error: "Vui lòng điền đầy đủ thông tin!",
                oldData: req.body,
            });
            return;
        }
        await CRUDService_1.default.createNewUser({ firstName, lastName, email });
        res.redirect("/crud");
    }
    catch (error) {
        console.error("Error creating user:", error);
        if (error.message &&
            error.message.includes("E11000 duplicate key error")) {
            res.render("crud", {
                error: "❌ Email đã tồn tại! Vui lòng sử dụng email khác.",
                oldData: req.body,
            });
            return;
        }
        res.render("crud", {
            error: "❌ Có lỗi xảy ra khi tạo user!",
            oldData: req.body,
        });
    }
};
// Get all users
HomeController.displayGetCRUD = async (req, res) => {
    try {
        console.log("Fetching all users");
        const data = await CRUDService_1.default.getAllUsers();
        console.log("Users found:", data.length);
        res.render("users/findAllUser", { dataUser: data });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
};
// Render edit user form
HomeController.getEditCRUD = async (req, res) => {
    try {
        const userId = req.query.id;
        console.log("Editing user:", userId);
        if (!userId) {
            res.status(400).send("User ID is required");
            return;
        }
        const user = await CRUDService_1.default.getUserById(userId);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.render("users/updateUser", { dataUser: user });
    }
    catch (error) {
        console.error("Error fetching user for edit:", error);
        res.status(500).send("Error fetching user");
    }
};
// Update user
HomeController.putCRUD = async (req, res) => {
    try {
        const { id, firstName, lastName, email } = req.body;
        if (!id) {
            // Lấy user data để render lại form
            const user = await CRUDService_1.default.getUserById(id);
            res.render("users/updateUser", {
                error: "❌ User ID không hợp lệ!",
                dataUser: user || req.body,
            });
            return;
        }
        const updatedUser = await CRUDService_1.default.updateUserData(id, {
            firstName,
            lastName,
            email,
        });
        if (!updatedUser) {
            const user = await CRUDService_1.default.getUserById(id);
            res.render("users/updateUser", {
                error: "❌ Không tìm thấy user!",
                dataUser: user || req.body,
            });
            return;
        }
        res.redirect("/crud");
    }
    catch (error) {
        console.error("Error updating user:", error);
        if (error.message &&
            error.message.includes("E11000 duplicate key error")) {
            const user = await CRUDService_1.default.getUserById(req.body.id);
            res.render("users/updateUser", {
                error: "❌ Email đã tồn tại! Vui lòng sử dụng email khác.",
                dataUser: user || req.body,
            });
            return;
        }
        const user = await CRUDService_1.default.getUserById(req.body.id);
        res.render("users/updateUser", {
            error: "❌ Có lỗi xảy ra khi cập nhật user!",
            dataUser: user || req.body,
        });
    }
};
// Sửa hàm getHomePage
HomeController.getHomePage = (req, res) => {
    res.render("crud", { error: null, oldData: null });
};
// Delete user
HomeController.deleteCRUD = async (req, res) => {
    try {
        const id = req.query.id;
        console.log("Deleting user:", id);
        if (!id) {
            res.status(400).send("User ID is required");
            return;
        }
        const deletedUser = await CRUDService_1.default.deleteUserById(id);
        if (!deletedUser) {
            res.status(404).send("User not found");
            return;
        }
        // Redirect về trang danh sách users sau khi delete
        res.redirect("/crud");
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
};
exports.default = HomeController;
