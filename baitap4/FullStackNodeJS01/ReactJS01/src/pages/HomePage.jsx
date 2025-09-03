// src/pages/HomePage.jsx - Updated để thêm navigation đến products
import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Statistic,
  List,
  Avatar,
} from "antd";
import {
  ShoppingOutlined,
  AppstoreOutlined,
  TrophyOutlined,
  FireOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import { productAPI } from "../services/productService";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // Load featured products (sản phẩm nổi bật)
      const productsResponse = await productAPI.getProductsByCategory(
        "all",
        1,
        8
      );
      if (productsResponse.EC === 0) {
        setFeaturedProducts(productsResponse.DT.products);
        setStats((prev) => ({
          ...prev,
          totalProducts: productsResponse.DT.pagination.totalProducts,
        }));
      }

      // Load categories
      const categoriesResponse = await productAPI.getAllCategories();
      if (categoriesResponse.EC === 0) {
        setCategories(categoriesResponse.DT);
        setStats((prev) => ({
          ...prev,
          totalCategories: categoriesResponse.DT.length,
        }));
      }
    } catch (error) {
      console.error("Error loading home data:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1890ff",
          }}
        >
          MyShop
        </div>
        <Space>
          <span>Xin chào, {user?.email || "User"}</span>
          <Button onClick={() => navigate("/products")} type="primary">
            Xem sản phẩm
          </Button>
          <Button onClick={handleLogout} type="default">
            Đăng xuất
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: "24px" }}>
        {/* Hero Section */}
        <Card
          style={{
            marginBottom: "24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
          }}
        >
          <Row justify="center" align="middle" style={{ minHeight: "200px" }}>
            <Col xs={24} md={12} style={{ textAlign: "center" }}>
              <Title level={2} style={{ color: "white", marginBottom: "16px" }}>
                Chào mừng đến với MyShop
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "16px",
                  marginBottom: "24px",
                }}
              >
                Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                onClick={() => navigate("/products")}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                Mua sắm ngay
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Tổng sản phẩm"
                value={stats.totalProducts}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Danh mục"
                value={stats.totalCategories}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Người dùng"
                value={1}
                prefix={<FireOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card>
              <Statistic
                title="Đánh giá"
                value={4.8}
                precision={1}
                prefix={<TrophyOutlined />}
                suffix="/ 5"
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Featured Products */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <FireOutlined style={{ color: "#ff4d4f" }} />
                  Sản phẩm nổi bật
                </Space>
              }
              extra={
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/products")}
                >
                  Xem tất cả
                </Button>
              }
            >
              <Row gutter={[16, 16]}>
                {featuredProducts.slice(0, 6).map((product) => (
                  <Col key={product._id} xs={12} sm={8} md={8}>
                    <Card
                      hoverable
                      size="small"
                      cover={
                        <img
                          alt={product.name}
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/200x150?text=No+Image"
                          }
                          style={{ height: 120, objectFit: "cover" }}
                        />
                      }
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      <Card.Meta
                        title={
                          <div
                            style={{
                              fontSize: "14px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.name}
                          </div>
                        }
                        description={
                          <div
                            style={{
                              color: "#ff4d4f",
                              fontWeight: "bold",
                              fontSize: "12px",
                            }}
                          >
                            {formatPrice(product.price)}
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* Categories */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <AppstoreOutlined style={{ color: "#1890ff" }} />
                  Danh mục sản phẩm
                </Space>
              }
              extra={
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/products")}
                >
                  Xem tất cả
                </Button>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={categories.slice(0, 5)}
                renderItem={(category) => (
                  <List.Item
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/products?category=${category._id}`)
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ backgroundColor: "#1890ff" }}
                          icon={<AppstoreOutlined />}
                        />
                      }
                      title={category.name}
                      description={
                        category.description || "Nhiều sản phẩm chất lượng"
                      }
                    />
                    <ArrowRightOutlined style={{ color: "#8c8c8c" }} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row gutter={[16, 16]} style={{ marginTop: "32px" }}>
          <Col span={24}>
            <Card title="Thao tác nhanh">
              <Space wrap>
                <Button
                  type="primary"
                  icon={<AppstoreOutlined />}
                  onClick={() => navigate("/products")}
                >
                  Tất cả sản phẩm
                </Button>
                {categories.slice(0, 4).map((category) => (
                  <Button
                    key={category._id}
                    onClick={() =>
                      navigate(`/products?category=${category._id}`)
                    }
                  >
                    {category.name}
                  </Button>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: "center", background: "#f0f2f5" }}>
        MyShop ©2024 Created with ❤️
      </Footer>
    </Layout>
  );
};

export default HomePage;
