// src/pages/ForgotPassword.jsx
import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: gọi API quên mật khẩu ở đây
    console.log("Gửi yêu cầu reset mật khẩu cho:", email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Quên mật khẩu</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Nhập email của bạn"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
