import React, { useState } from "react";
import { Form, Input, Button, Alert, Result } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import authService from "../../services/authService";

const ForgotPasswordForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setError("");

    try {
      await authService.forgotPassword(values.email);
      setSuccess(true);
    } catch (error) {
      setError(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <Result
          status="success"
          title="Email đã được gửi!"
          subTitle="Vui lòng kiểm tra email của bạn để reset mật khẩu. Link sẽ hết hạn sau 10 phút."
          extra={[
            <Button type="primary" key="back">
              <Link to="/login">
                <ArrowLeftOutlined /> Trở về đăng nhập
              </Link>
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h1>
        <p className="text-gray-600 mt-2">
          Nhập email của bạn để nhận link reset mật khẩu
        </p>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError("")}
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="forgotPassword"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="email@example.com" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12"
          >
            Gửi link reset mật khẩu
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center">
        <Link to="/login" className="text-blue-600 hover:text-blue-500">
          <ArrowLeftOutlined /> Trở về đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
