import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Badge,
  Dropdown,
  Avatar,
  Space,
  Drawer,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  MenuOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useProducts } from "../../hooks/useProducts";
import CategoryMenu from "../product/CategoryMenu";
import SearchBar from "../product/SearchBar";

const { Header: AntHeader } = Layout;

const Header = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { categories } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        <Link to="/profile">Trang cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
        <Link to="/orders">Đơn hàng của tôi</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const mobileMenu = (
    <div className="p-4">
      <div className="space-y-4">
        <CategoryMenu
          categories={categories}
          mode="vertical"
          className="border-none"
        />

        <div className="border-t pt-4">
          {isAuthenticated ? (
            <Space direction="vertical" className="w-full">
              <Link to="/profile" className="block">
                <Button
                  type="text"
                  icon={<ProfileOutlined />}
                  className="w-full text-left"
                >
                  Trang cá nhân
                </Button>
              </Link>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                className="w-full text-left text-red-600"
              >
                Đăng xuất
              </Button>
            </Space>
          ) : (
            <Space direction="vertical" className="w-full">
              <Link to="/login">
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  className="w-full"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button icon={<UserOutlined />} className="w-full">
                  Đăng ký
                </Button>
              </Link>
            </Space>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AntHeader className="bg-white shadow-sm px-0 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={<MenuOutlined />}
              className="md:hidden"
              onClick={() => setMobileMenuVisible(true)}
            />
            <Link to="/" className="text-2xl font-bold text-blue-600">
              E-Store
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-2">
            {/* Search Icon - Mobile only */}
            <Button
              type="text"
              icon={<SearchOutlined />}
              className="md:hidden"
              onClick={() => navigate("/search")}
            />

            {/* Cart */}
            <Badge count={0} showZero={false}>
              <Button type="text" icon={<ShoppingCartOutlined />} />
            </Badge>

            {/* Wishlist */}
            <Badge count={0} showZero={false}>
              <Button type="text" icon={<HeartOutlined />} />
            </Badge>

            {/* User Menu */}
            {isAuthenticated ? (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <div className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    src={user?.avatar}
                  />
                  <span className="hidden sm:inline text-gray-700">
                    {user?.fullName || user?.username}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button type="text">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary">Đăng ký</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </AntHeader>

      {/* Categories Menu - Desktop */}
      <div className="hidden md:block bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto">
          <CategoryMenu categories={categories} />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
      >
        {mobileMenu}
      </Drawer>
    </>
  );
};

export default Header;
