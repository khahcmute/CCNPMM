// src/util/api.js
import axios from "axios";
import { STORAGE_KEYS } from "./constants";

export const API_BASE_URL = "http://localhost:3000/api"; // chỉnh nếu cần

export const API_ENDPOINTS = {
  REGISTER: "/register",
  LOGIN: "/login",
  GET_PROFILE: "/profile",
  GET_USERS: "/users",
};

export const callAPI = async (
  endpoint,
  method = "GET",
  data = null,
  headers = {}
) => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method,
      data,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      withCredentials: false,
    });
    return response.data;
  } catch (err) {
    // chuẩn hoá trả về object (không throw) để dễ xử lý ở UI
    if (err.response && err.response.data) return err.response.data;
    return { success: false, message: err.message || "Network error" };
  }
};
