// src/pages/ProductListPage.jsx - Tên file tương thích với pattern cũ
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Select,
  Input,
  Button,
  Spin,
  message,
  Empty,
  Tag,
  Space,
  Divider,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import { productAPI } from "../services/productService";
import InfiniteScroll from "react-infinite-scroll-component";

const { Header, Content } = Layout;
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState("grid");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const limit = 12;

  // Load categories và initial data
  useEffect(() => {
    loadCategories();

    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("sortOrder") || "desc";

    setSelectedCategory(category);
    setSearchTerm(search);
    setSortBy(sort);
    setSortOrder(order);
  }, []);

  useEffect(() => {
    resetAndLoadProducts();
  }, [selectedCategory, searchTerm, sortBy, sortOrder]);

  const loadCategories = async () => {
    try {
      const response = await productAPI.getAllCategories();
      if (response.EC === 0) {
        setCategories(response.DT);
      }
    } catch (error) {
      message.error("Không thể tải danh mục sản phẩm");
    }
  };

  const resetAndLoadProducts = useCallback(async () => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setInitialLoading(true);

    try {
      let response;
      if (searchTerm.trim()) {
        response = await productAPI.searchProducts(
          searchTerm,
          selectedCategory,
          1,
          limit
        );
      } else {
        response = await productAPI.getProductsByCategory(
          selectedCategory,
          1,
          limit,
          sortBy,
          sortOrder
        );
      }

      if (response.EC === 0) {
        setProducts(response.DT.products);
        setPagination(response.DT.pagination);
        setHasMore(response.DT.pagination.hasNextPage);
        setCurrentPage(2);
      } else {
        message.error(response.EM);
      }
    } catch (error) {
      message.error("Không thể tải danh sách sản phẩm");
    } finally {
      setInitialLoading(false);
    }
  }, [selectedCategory, searchTerm, sortBy, sortOrder]);

  const loadMoreProducts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      let response;
      if (searchTerm.trim()) {
        response = await productAPI.searchProducts(
          searchTerm,
          selectedCategory,
          currentPage,
          limit
        );
      } else {
        response = await productAPI.getProductsByCategory(
          selectedCategory,
          currentPage,
          limit,
          sortBy,
          sortOrder
        );
      }

      if (response.EC === 0) {
        setProducts((prev) => [...prev, ...response.DT.products]);
        setPagination(response.DT.pagination);
        setHasMore(response.DT.pagination.hasNextPage);
        setCurrentPage((prev) => prev + 1);
      }
    } catch (error) {
      message.error("Không thể tải thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    updateURL({ category: value });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    updateURL({ search: value });
  };

  const handleSortChange = (value) => {
    const [sortField, order] = value.split("-");
    setSortBy(sortField);
    setSortOrder(order);
    updateURL({ sortBy: sortField, sortOrder: order });
  };

  const updateURL = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderProductCard = (product) => (
    <Card
      key={product._id}
      hoverable
      cover={
        <img
          alt={product.name}
          src={
            product.images?.[0] ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          style={{ height: 200, objectFit: "cover" }}
        />
      }
      actions={[
        <EyeOutlined onClick={() => navigate(`/products/${product._id}`)} />,
        <ShoppingCartOutlined
          style={{ color: product.stock > 0 ? undefined : "#ccc" }}
        />,
      ]}
    >
      <Meta
        title={product.name}
        description={
          <div>
            <p
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.description}
            </p>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Tag color="blue">{product.category?.name}</Tag>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#ff4d4f",
                }}
              >
                {formatPrice(product.price)}
              </div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                {product.stock > 0 ? `Kho: ${product.stock}` : "Hết hàng"}
              </div>
            </Space>
          </div>
        }
      />
    </Card>
  );

  if (initialLoading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <div style={{ textAlign: "center", padding: "100px" }}>
          <Spin size="large" />
          <p>Đang tải sản phẩm...</p>
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
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
          >
            Trang chủ
          </Button>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1890ff",
            }}
          >
            Sản phẩm
          </div>
        </Space>
        <Space>
          <span>Xin chào, {user?.email || "User"}</span>
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </Space>
      </Header>

      <Content style={{ padding: "24px" }}>
        {/* Bộ lọc */}
        <Card style={{ marginBottom: "20px" }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                style={{ width: "100%" }}
              />
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{ width: "100%" }}
              >
                <Option value="all">Tất cả danh mục</Option>
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                style={{ width: "100%" }}
              >
                <Option value="createdAt-desc">Mới nhất</Option>
                <Option value="createdAt-asc">Cũ nhất</Option>
                <Option value="price-asc">Giá thấp → cao</Option>
                <Option value="price-desc">Giá cao → thấp</Option>
                <Option value="name-asc">Tên A → Z</Option>
                <Option value="name-desc">Tên Z → A</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Button.Group>
                <Button
                  type={viewMode === "grid" ? "primary" : "default"}
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode("grid")}
                />
                <Button
                  type={viewMode === "list" ? "primary" : "default"}
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewMode("list")}
                />
              </Button.Group>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: "right" }}>
                Tìm thấy {pagination.totalProducts || 0} sản phẩm
              </div>
            </Col>
          </Row>
        </Card>

        {/* Danh sách sản phẩm */}
        {products.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không tìm thấy sản phẩm nào"
          />
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={loadMoreProducts}
            hasMore={hasMore}
            loader={
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin />
                <p>Đang tải thêm sản phẩm...</p>
              </div>
            }
            endMessage={
              <Divider>
                <span style={{ color: "#999" }}>
                  Đã hiển thị tất cả {products.length} sản phẩm
                </span>
              </Divider>
            }
          >
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col
                  key={product._id}
                  xs={24}
                  sm={viewMode === "grid" ? 12 : 24}
                  md={viewMode === "grid" ? 8 : 24}
                  lg={viewMode === "grid" ? 6 : 24}
                >
                  {renderProductCard(product)}
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        )}
      </Content>
    </Layout>
  );
};

export default ProductListPage;
