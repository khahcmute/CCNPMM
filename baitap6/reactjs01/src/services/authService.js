import api from "./api";

class AuthService {
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  }

  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    const { data } = response.data;

    if (data.tokens) {
      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return response.data;
  }

  async logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  }

  async resetPassword(token, newPassword) {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  }

  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  }
}

export default new AuthService();
