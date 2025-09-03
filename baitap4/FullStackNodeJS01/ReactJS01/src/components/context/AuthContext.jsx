// src/components/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { callAPI, API_ENDPOINTS } from "../../util/api";
import { STORAGE_KEYS } from "../../util/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // khi app load, đọc localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await callAPI(API_ENDPOINTS.LOGIN, "POST", { email, password });
    if (res && res.success) {
      // backend trả về dạng: { success: true, data: { token, user } } hoặc { success: true, token, user }
      const token = res.data?.token ?? res.token;
      const userObj = res.data?.user ?? res.user;
      if (token && userObj) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
        setUser(userObj);
        return { success: true, user: userObj };
      }
      return { success: false, message: res.message || "Invalid response" };
    }
    return { success: false, message: res.message || "Login failed" };
  };

  const register = async (payload) => {
    const res = await callAPI(API_ENDPOINTS.REGISTER, "POST", payload);
    return res;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export { AuthContext };
