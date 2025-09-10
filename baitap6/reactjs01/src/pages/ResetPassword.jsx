// src/pages/ResetPassword.jsx
import { useState } from "react";

const ResetPassword = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    console.log("Reset password data:", form);
    // TODO: call API reset password
  };

  return (
    <div>
      <h1>Đặt lại mật khẩu</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu mới"
          value={form.password}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Đặt lại mật khẩu</button>
      </form>
    </div>
  );
};

export default ResetPassword;
