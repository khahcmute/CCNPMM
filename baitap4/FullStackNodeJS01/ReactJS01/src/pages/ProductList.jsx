// src/pages/ProductList.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
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
  FilterOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { productAPI } from "../services/productService";
import InfiniteScroll from "react-infinite-scroll-component";

const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // 'grid' hoặc 'list'

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const limit = 12; // Số sản phẩm mỗi lần load

  // Load categories khi component mount
  useEffect(() => {
    loadCategories();

    // Lấy params từ URL
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("sortOrder") || "desc";

    setSelectedCategory(category);
    setSearchTerm(search);
    setSortBy(sort);
    setSortOrder(order);
  }, []);

  // Load sản phẩm khi filter thay đổi
  useEffect(() => {
    resetAndLoadProducts();
  }, [selectedCategory, searchTerm, sortBy, sortOrder]);

  // Load danh mục
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

  // Reset và load sản phẩm từ đầu
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

  // Load thêm sản phẩm (Lazy Loading)
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

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    updateURL({ category: value });
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value);
    updateURL({ search: value });
  };

  // Xử lý thay đổi sort
  const handleSortChange = (value) => {
    const [sortField, order] = value.split("-");
    setSortBy(sortField);
    setSortOrder(order);
    updateURL({ sortBy: sortField, sortOrder: order });
  };

  // Cập nhật URL params
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

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Render product card
  const renderProductCard = (product) => {
    const isGridMode = viewMode === "grid";

    return (
      <Card
        key={product._id}
        hoverable
        className={isGridMode ? "" : "product-list-card"}
        cover={
          <img
            alt={product.name}
            src={product.images[0]}
            style={{
              height: isGridMode ? 200 : 120,
              objectFit: "cover",
            }}
          />
        }
        actions={[
          <EyeOutlined onClick={() => navigate(`/products/${product._id}`)} />,
          <ShoppingCartOutlined />,
        ]}
      >
        <Meta
          title={product.name}
          description={
            <div>
              <p
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: isGridMode ? 2 : 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description}
              </p>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Tag color="blue">{product.category.name}</Tag>
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
                  Kho: {product.stock}
                </div>
              </Space>
            </div>
          }
        />
      </Card>
    );
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách sản phẩm</h1>

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
    </div>
  );
};

export default ProductList;
