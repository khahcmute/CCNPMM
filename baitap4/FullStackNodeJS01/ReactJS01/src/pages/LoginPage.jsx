// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useAuth } from "../components/context/AuthContext";

const { Title, Text } = Typography;

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await login(values.email, values.password);
      console.log("login result:", res);
      if (res.success) {
        message.success("Đăng nhập thành công!");
        navigate("/"); // home path
      } else {
        message.error(res.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Lỗi máy chủ, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <Card style={{ maxWidth: 420, margin: "80px auto", textAlign: "center" }}>
        <Title level={4}>
          Xin chào, {user.firstName ?? user.name ?? "User"} 👋
        </Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
      <Card style={{ width: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <Title level={3}>Đăng nhập</Title>
          <Text type="secondary">Nhập email & mật khẩu</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text>Chưa có tài khoản? </Text>
          <Link to="/register">Đăng ký</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
