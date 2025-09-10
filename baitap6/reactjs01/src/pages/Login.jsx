// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { login, error, loading } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials); // gọi redux action login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Nhập email"
          />

          <label className="block mb-2 text-sm font-medium">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Nhập mật khẩu"
          />

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
