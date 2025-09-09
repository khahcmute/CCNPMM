import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = () => {
  const [form] = Form.useForm();
  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onFinish = async (values) => {
    try {
      await login(values).unwrap();
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
        <p className="text-gray-600 mt-2">Chào mừng bạn trở lại!</p>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={clearError}
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          label="Email hoặc tên đăng nhập"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email hoặc tên đăng nhập!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="email@example.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between items-center">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-500"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider>hoặc</Divider>

      <Button
        icon={<GoogleOutlined />}
        className="w-full h-12 mb-4"
        onClick={() => {
          // Implement Google login
          console.log("Google login");
        }}
      >
        Đăng nhập với Google
      </Button>

      <div className="text-center">
        <span className="text-gray-600">Chưa có tài khoản? </span>
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
