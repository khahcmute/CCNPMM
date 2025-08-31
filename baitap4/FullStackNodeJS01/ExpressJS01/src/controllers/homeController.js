const UserService = require("../services/userService");

class HomeController {
  static async getHome(req, res) {
    try {
      // Get user profile từ token
      const userResult = await UserService.getUserProfile(req.user.userId);

      if (!userResult.success) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const homeData = {
        success: true,
        message: "Welcome to the home page!",
        timestamp: new Date().toISOString(),
        user: userResult.user,
        stats: {
          totalVisits: Math.floor(Math.random() * 1000) + 1,
          onlineUsers: Math.floor(Math.random() * 50) + 1,
          systemStatus: "Online",
        },
      };

      return res.status(200).json(homeData);
    } catch (error) {
      console.error("Home controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  }

  static async renderHome(req, res) {
    try {
      const userResult = await UserService.getUserProfile(req.user.userId);

      const data = {
        title: "Home Page",
        user: userResult.success ? userResult.user : null,
        message: "Welcome to our FullStack Application!",
      };

      return res.render("index", data);
    } catch (error) {
      console.error("Render home error:", error);
      return res.status(500).render("error", {
        message: "Internal server error",
      });
    }
  }
}

module.exports = HomeController;
