import React, { useEffect } from "react";
import { Row, Col, Typography, Button, Carousel } from "antd";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/product/ProductCard";
import Loading from "../components/common/Loading";

const { Title, Paragraph } = Typography;

const Home = () => {
  const { featuredProducts, categories, getFeaturedProducts, loading } =
    useProducts();

  useEffect(() => {
    getFeaturedProducts(12);
  }, []);

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
    // Implement add to cart functionality
  };

  const handleAddToWishlist = (product) => {
    console.log("Add to wishlist:", product);
    // Implement add to wishlist functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <div className="space-y-6">
                <Title
                  level={1}
                  className="text-white text-4xl md:text-5xl font-bold"
                >
                  Mua sắm trực tuyến dễ dàng
                </Title>
                <Paragraph className="text-xl text-gray-100">
                  Khám phá hàng ngàn sản phẩm chất lượng cao với giá tốt nhất.
                  Giao hàng nhanh chóng và dịch vụ khách hàng tận tâm.
                </Paragraph>
                <div className="space-x-4">
                  <Link to="/products">
                    <Button
                      type="primary"
                      size="large"
                      className="bg-white text-blue-600 border-white hover:bg-gray-100"
                    >
                      Mua sắm ngay
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="large" ghost>
                      Tìm hiểu thêm
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="text-center">
                <img
                  src="/hero-image.png"
                  alt="E-commerce hero"
                  className="max-w-full h-auto"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2}>Danh mục sản phẩm</Title>
            <Paragraph className="text-lg text-gray-600">
              Khám phá các danh mục sản phẩm đa dạng
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {categories.slice(0, 6).map((category) => (
              <Col xs={12} sm={8} lg={4} key={category.id}>
                <Link to={`/category/${category.slug}`}>
                  <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <img
                        src={category.image || "/category-placeholder.png"}
                        alt={category.name}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.target.src = "/category-placeholder.png";
                        }}
                      />
                    </div>
                    <Title level={5} className="mb-2">
                      {category.name}
                    </Title>
                    <Paragraph className="text-gray-600 text-sm mb-0">
                      {category.productCount || 0} sản phẩm
                    </Paragraph>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2}>Sản phẩm nổi bật</Title>
            <Paragraph className="text-lg text-gray-600">
              Những sản phẩm được yêu thích nhất
            </Paragraph>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <Row gutter={[24, 24]}>
              {featuredProducts.map((product) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-8">
            <Link to="/products">
              <Button type="primary" size="large">
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🚚
                </div>
                <Title level={4}>Giao hàng miễn phí</Title>
                <Paragraph className="text-gray-600">
                  Miễn phí giao hàng cho đơn hàng trên 500k
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  💳
                </div>
                <Title level={4}>Thanh toán an toàn</Title>
                <Paragraph className="text-gray-600">
                  Bảo mật thông tin thanh toán 100%
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🔄
                </div>
                <Title level={4}>Đổi trả dễ dàng</Title>
                <Paragraph className="text-gray-600">
                  Đổi trả trong vòng 30 ngày
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  📞
                </div>
                <Title level={4}>Hỗ trợ 24/7</Title>
                <Paragraph className="text-gray-600">
                  Hỗ trợ khách hàng mọi lúc mọi nơi
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Home;
