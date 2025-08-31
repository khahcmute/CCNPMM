// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { callAPI, API_ENDPOINTS } from "../util/api";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await callAPI(API_ENDPOINTS.REGISTER, "POST", values);

      if (response.success) {
        message.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        message.error(response.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      message.error("Lỗi máy chủ, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-4">
        <div className="text-center mb-6">
          <Title level={3}>Tạo tài khoản mới</Title>
          <Text type="secondary">Nhanh chóng và dễ dàng</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "Họ là bắt buộc" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ" size="large" />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Tên là bắt buộc" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email là bắt buộc" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Mật khẩu là bắt buộc" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Xác nhận mật khẩu là bắt buộc" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="rounded-lg"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Text>Bạn đã có tài khoản? </Text>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
