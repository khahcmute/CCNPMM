import { Request, Response } from "express";
import CRUDService from "../services/CRUDService";

class HomeController {
  // Render home page
  static getHomePage = (req: Request, res: Response): void => {
    console.log("Accessing home page");
    console.log("Views directory:", res.app.get("views"));
    try {
      res.render("crud");
    } catch (error) {
      console.error("Error rendering home page:", error);
      res.status(500).send("Error rendering page");
    }
  };

  // Create new user
  static postCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
      const { firstName, lastName, email } = req.body;

      if (!firstName || !lastName || !email) {
        res.render("crud", {
          error: "Vui lòng điền đầy đủ thông tin!",
          oldData: req.body,
        });
        return;
      }

      await CRUDService.createNewUser({ firstName, lastName, email });
      res.redirect("/crud");
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (
        error.message &&
        error.message.includes("E11000 duplicate key error")
      ) {
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
  static displayGetCRUD = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log("Fetching all users");
      const data = await CRUDService.getAllUsers();
      console.log("Users found:", data.length);
      res.render("users/findAllUser", { dataUser: data });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Error fetching users");
    }
  };

  // Render edit user form
  static getEditCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.id as string;
      console.log("Editing user:", userId);

      if (!userId) {
        res.status(400).send("User ID is required");
        return;
      }

      const user = await CRUDService.getUserById(userId);

      if (!user) {
        res.status(404).send("User not found");
        return;
      }

      res.render("users/updateUser", { dataUser: user });
    } catch (error) {
      console.error("Error fetching user for edit:", error);
      res.status(500).send("Error fetching user");
    }
  };

  // Update user
  static putCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, firstName, lastName, email } = req.body;

      if (!id) {
        // Lấy user data để render lại form
        const user = await CRUDService.getUserById(id);
        res.render("users/updateUser", {
          error: "❌ User ID không hợp lệ!",
          dataUser: user || req.body,
        });
        return;
      }

      const updatedUser = await CRUDService.updateUserData(id, {
        firstName,
        lastName,
        email,
      });

      if (!updatedUser) {
        const user = await CRUDService.getUserById(id);
        res.render("users/updateUser", {
          error: "❌ Không tìm thấy user!",
          dataUser: user || req.body,
        });
        return;
      }

      res.redirect("/crud");
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (
        error.message &&
        error.message.includes("E11000 duplicate key error")
      ) {
        const user = await CRUDService.getUserById(req.body.id);
        res.render("users/updateUser", {
          error: "❌ Email đã tồn tại! Vui lòng sử dụng email khác.",
          dataUser: user || req.body,
        });
        return;
      }
      const user = await CRUDService.getUserById(req.body.id);
      res.render("users/updateUser", {
        error: "❌ Có lỗi xảy ra khi cập nhật user!",
        dataUser: user || req.body,
      });
    }
  };

  // Sửa hàm getHomePage
  static getHomePage = (req: Request, res: Response): void => {
    res.render("crud", { error: null, oldData: null });
  };
  // Delete user
  static deleteCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.query.id as string;
      console.log("Deleting user:", id);

      if (!id) {
        res.status(400).send("User ID is required");
        return;
      }

      const deletedUser = await CRUDService.deleteUserById(id);

      if (!deletedUser) {
        res.status(404).send("User not found");
        return;
      }

      // Redirect về trang danh sách users sau khi delete
      res.redirect("/crud");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Error deleting user");
    }
  };
}

export default HomeController;
