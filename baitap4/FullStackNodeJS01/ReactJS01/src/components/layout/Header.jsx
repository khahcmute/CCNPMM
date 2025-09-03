// src/components/layout/Header.jsx - Updated với menu sản phẩm
import React, { useContext, useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Space,
  Avatar,
  Dropdown,
  Badge,
  Input,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCategories } from "../../hooks/useProducts";

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { categories } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0); // TODO: Implement cart context

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
    } else {
      navigate("/products");
    }
  };

  // Menu items cho danh mục sản phẩm
  const categoryMenuItems = categories.map((category) => ({
    key: category._id,
    label: (
      <Link to={`/products?category=${category._id}`}>{category.name}</Link>
    ),
  }));

  // Dropdown menu cho danh mục
  const categoriesDropdown = {
    items: [
      {
        key: "all",
        label: <Link to="/products">Tất cả sản phẩm</Link>,
      },
      { type: "divider" },
      ...categoryMenuItems,
    ],
  };

  // User menu dropdown
  const userMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: <Link to="/profile">Thông tin cá nhân</Link>,
      },
      {
        key: "orders",
        icon: <AppstoreOutlined />,
        label: <Link to="/orders">Đơn hàng của tôi</Link>,
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: handleLogout,
      },
    ],
  };

  // Main navigation menu
  const navigationItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "products",
      icon: <AppstoreOutlined />,
      label: (
        <Dropdown menu={categoriesDropdown} trigger={["hover"]}>
          <Link to="/products">Sản phẩm</Link>
        </Dropdown>
      ),
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.startsWith("/products")) return "products";
    return "";
  };

  return (
    <AntHeader
      style={{
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1890ff",
              textDecoration: "none",
              marginRight: "32px",
            }}
          >
            MyShop
          </Link>
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1, maxWidth: "600px" }}>
          <Menu
            mode="horizontal"
            selectedKeys={[getSelectedKey()]}
            items={navigationItems}
            style={{
              border: "none",
              backgroundColor: "transparent",
            }}
          />
        </div>

        {/* Search Bar */}
        <div style={{ margin: "0 24px", minWidth: "300px" }}>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            style={{ width: "100%" }}
          />
        </div>

        {/* User Actions */}
        <Space size="middle">
          {/* Shopping Cart */}
          <Badge count={cartCount} size="small">
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: "18px" }} />}
              onClick={() => navigate("/cart")}
            />
          </Badge>

          {user ? (
            <Dropdown menu={userMenu} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user.avatar}
                />
                <span style={{ color: "#262626" }}>
                  {user.email?.split("@")[0] || user.username}
                </span>
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button
                type="text"
                icon={<LoginOutlined />}
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
              <Button type="primary" onClick={() => navigate("/register")}>
                Đăng ký
              </Button>
            </Space>
          )}
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;
