// src/pages/ProductDetailPage.jsx - Tương thích với pattern cũ
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Card,
  Image,
  Button,
  InputNumber,
  Space,
  Tag,
  Descriptions,
  message,
  Spin,
  Breadcrumb,
  Rate,
  Divider,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../components/context/AuthContext";
import { productAPI } from "../services/productService";

const { Header, Content } = Layout;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);

      if (response.EC === 0) {
        setProduct(response.DT);
      } else {
        message.error(response.EM);
        navigate("/products");
      }
    } catch (error) {
      message.error("Không thể tải thông tin sản phẩm");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (quantity > product.stock) {
      message.warning("Số lượng vượt quá hàng tồn kho");
      return;
    }

    // TODO: Implement add to cart logic
    message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (quantity > product.stock) {
      message.warning("Số lượng vượt quá hàng tồn kho");
      return;
    }

    // TODO: Implement buy now logic
    message.info("Chức năng mua ngay đang được phát triển");
  };

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <div style={{ textAlign: "center", padding: "100px" }}>
          <Spin size="large" />
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <div style={{ textAlign: "center", padding: "100px" }}>
          <p>Không tìm thấy sản phẩm</p>
          <Button onClick={() => navigate("/products")}>
            Quay lại danh sách sản phẩm
          </Button>
        </div>
      </Layout>
    );
  }

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
        <Space>
          <Button
            type="text"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
          >
            Trang chủ
          </Button>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/products")}
          >
            Sản phẩm
          </Button>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#1890ff",
            }}
          >
            Chi tiết sản phẩm
          </div>
        </Space>
        <Space>
          <span>Xin chào, {user?.email || "User"}</span>
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </Space>
      </Header>

      <Content
        style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Breadcrumb */}
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item>
            <Button
              type="link"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
            >
              Trang chủ
            </Button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Button type="link" onClick={() => navigate("/products")}>
              Sản phẩm
            </Button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{product.category?.name}</Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[32, 32]}>
          {/* Hình ảnh sản phẩm */}
          <Col xs={24} md={12}>
            <Card>
              <div style={{ textAlign: "center" }}>
                <Image
                  width="100%"
                  height={400}
                  src={
                    product.images?.[selectedImage] ||
                    "https://via.placeholder.com/400x400?text=No+Image"
                  }
                  alt={product.name}
                  style={{ objectFit: "cover" }}
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    gap: "8px",
                    overflowX: "auto",
                  }}
                >
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        border:
                          selectedImage === index
                            ? "2px solid #1890ff"
                            : "1px solid #d9d9d9",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Thông tin sản phẩm */}
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <h1 style={{ marginBottom: "8px" }}>{product.name}</h1>
                <Space size="middle">
                  <Tag color="blue">{product.category?.name}</Tag>
                  <Rate disabled defaultValue={4.5} />
                  <span style={{ color: "#8c8c8c" }}>(0 đánh giá)</span>
                </Space>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#ff4d4f",
                    marginBottom: "8px",
                  }}
                >
                  {formatPrice(product.price)}
                </div>

                <Space>
                  {product.stock > 0 ? (
                    <>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <span style={{ color: "#52c41a" }}>
                        Còn hàng ({product.stock} sản phẩm)
                      </span>
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                      <span style={{ color: "#ff4d4f" }}>Hết hàng</span>
                    </>
                  )}
                </Space>
              </div>

              <div>
                <h3>Mô tả sản phẩm:</h3>
                <p
                  style={{
                    lineHeight: "1.6",
                    color: "#595959",
                  }}
                >
                  {product.description}
                </p>
              </div>

              {product.stock > 0 && (
                <div>
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <span style={{ marginRight: "16px" }}>Số lượng:</span>
                      <InputNumber
                        min={1}
                        max={product.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        style={{ width: "100px" }}
                      />
                      <span
                        style={{
                          marginLeft: "8px",
                          color: "#8c8c8c",
                        }}
                      >
                        (tối đa {product.stock})
                      </span>
                    </div>

                    <Space size="middle" wrap>
                      <Button
                        type="primary"
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        onClick={handleAddToCart}
                        style={{ minWidth: "150px" }}
                      >
                        Thêm vào giỏ
                      </Button>

                      <Button
                        type="primary"
                        size="large"
                        danger
                        onClick={handleBuyNow}
                        style={{ minWidth: "120px" }}
                      >
                        Mua ngay
                      </Button>

                      <Button
                        size="large"
                        icon={<HeartOutlined />}
                        style={{ minWidth: "50px" }}
                      />

                      <Button
                        size="large"
                        icon={<ShareAltOutlined />}
                        style={{ minWidth: "50px" }}
                      />
                    </Space>
                  </Space>
                </div>
              )}
            </Space>
          </Col>
        </Row>

        <Divider />

        {/* Thông tin chi tiết */}
        <Row gutter={[32, 32]} style={{ marginTop: "40px" }}>
          <Col span={24}>
            <Card title="Thông tin chi tiết">
              <Descriptions column={2}>
                <Descriptions.Item label="Tên sản phẩm">
                  {product.name}
                </Descriptions.Item>
                <Descriptions.Item label="Danh mục">
                  {product.category?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  {formatPrice(product.price)}
                </Descriptions.Item>
                <Descriptions.Item label="Tồn kho">
                  {product.stock} sản phẩm
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={product.status === "active" ? "green" : "red"}>
                    {product.status === "active" ? "Đang bán" : "Ngừng bán"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                  {product.description}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProductDetailPage;
