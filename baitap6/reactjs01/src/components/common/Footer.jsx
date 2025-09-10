import React from "react";
import { Layout, Row, Col, Space, Typography } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto">
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={4} className="text-white mb-4">
              E-Commerce Store
            </Title>
            <Text className="text-gray-300 block mb-4">
              Cửa hàng trực tuyến hàng đầu với hàng ngàn sản phẩm chất lượng cao
              và dịch vụ khách hàng tận tâm.
            </Text>
            <Space size="large">
              <FacebookOutlined className="text-xl hover:text-blue-500 cursor-pointer" />
              <TwitterOutlined className="text-xl hover:text-blue-400 cursor-pointer" />
              <InstagramOutlined className="text-xl hover:text-pink-500 cursor-pointer" />
              <YoutubeOutlined className="text-xl hover:text-red-500 cursor-pointer" />
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-4">
              Liên kết nhanh
            </Title>
            <div className="space-y-2">
              <Link
                to="/about"
                className="block text-gray-300 hover:text-white"
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="block text-gray-300 hover:text-white"
              >
                Liên hệ
              </Link>
              <Link
                to="/shipping"
                className="block text-gray-300 hover:text-white"
              >
                Chính sách giao hàng
              </Link>
              <Link
                to="/returns"
                className="block text-gray-300 hover:text-white"
              >
                Chính sách đổi trả
              </Link>
              <Link
                to="/terms"
                className="block text-gray-300 hover:text-white"
              >
                Điều khoản sử dụng
              </Link>
              <Link
                to="/privacy"
                className="block text-gray-300 hover:text-white"
              >
                Chính sách bảo mật
              </Link>
            </div>
          </Col>

          {/* Categories */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-4">
              Danh mục
            </Title>
            <div className="space-y-2">
              <Link
                to="/category/electronics"
                className="block text-gray-300 hover:text-white"
              >
                Điện tử
              </Link>
              <Link
                to="/category/clothing"
                className="block text-gray-300 hover:text-white"
              >
                Thời trang
              </Link>
              <Link
                to="/category/books"
                className="block text-gray-300 hover:text-white"
              >
                Sách
              </Link>
              <Link
                to="/category/home-garden"
                className="block text-gray-300 hover:text-white"
              >
                Nhà cửa & Sân vườn
              </Link>
              <Link
                to="/category/sports"
                className="block text-gray-300 hover:text-white"
              >
                Thể thao
              </Link>
            </div>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-4">
              Liên hệ
            </Title>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvironmentOutlined className="text-gray-300" />
                <Text className="text-gray-300">
                  123 Đường ABC, Quận 1, TP.HCM
                </Text>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneOutlined className="text-gray-300" />
                <Text className="text-gray-300">(028) 1234 5678</Text>
              </div>
              <div className="flex items-center space-x-3">
                <MailOutlined className="text-gray-300" />
                <Text className="text-gray-300">support@ecommerce.com</Text>
              </div>
            </div>
          </Col>
        </Row>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <Text className="text-gray-400">
            © 2024 E-Commerce Store. Tất cả quyền được bảo lưu.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
