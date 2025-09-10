import React, { useEffect, useCallback } from "react";
import { Row, Col, Typography, Empty } from "antd";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import ProductCard from "../components/product/ProductCard";
import ProductFilter from "../components/product/ProductFilter";
import Loading from "../components/common/Loading";
import { ITEMS_PER_PAGE } from "../utils/constants";

const { Title } = Typography;

const Products = () => {
  const [searchParams] = useSearchParams();
  const {
    products,
    pagination,
    filters,
    loading,
    error,
    hasNextPage,
    isLoadingMore,
    getProducts,
    updateFilters,
    resetFilters,
  } = useProducts();

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      categoryId: searchParams.get("categoryId"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      sortBy: searchParams.get("sortBy") || "newest",
      onSale: searchParams.get("onSale") === "true",
      featured: searchParams.get("featured") === "true",
      inStock: searchParams.get("inStock") === "true",
      minRating: searchParams.get("minRating"),
    };

    updateFilters(urlFilters);
  }, [searchParams, updateFilters]);

  // Load products when filters change
  useEffect(() => {
    const params = {
      page: 1,
      limit: ITEMS_PER_PAGE,
      ...filters,
    };

    getProducts(params);
  }, [filters]);

  // Infinite scroll handler
  const handleLoadMore = useCallback(
    (page) => {
      if (hasNextPage && !isLoadingMore) {
        const params = {
          page,
          limit: ITEMS_PER_PAGE,
          ...filters,
        };
        getProducts(params);
      }
    },
    [hasNextPage, isLoadingMore, filters, getProducts]
  );

  const { ref: infiniteRef, resetPage } = useInfiniteScroll({
    hasNextPage,
    isLoading: isLoadingMore,
    onLoadMore: handleLoadMore,
  });

  // Reset page when filters change
  useEffect(() => {
    resetPage();
  }, [filters, resetPage]);

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
    // Implement add to cart functionality
  };

  const handleAddToWishlist = (product) => {
    console.log("Add to wishlist:", product);
    // Implement add to wishlist functionality
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Title level={2}>Tất cả sản phẩm</Title>
          {pagination && (
            <p className="text-gray-600">
              Hiển thị {products.length} / {pagination.totalItems} sản phẩm
            </p>
          )}
        </div>

        <Row gutter={[24, 24]}>
          {/* Filters Sidebar */}
          <Col xs={24} lg={6}>
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <ProductFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
            </div>
          </Col>

          {/* Products Grid */}
          <Col xs={24} lg={18}>
            {loading && products.length === 0 ? (
              <Loading />
            ) : products.length > 0 ? (
              <>
                <Row gutter={[24, 24]}>
                  {products.map((product) => (
                    <Col xs={24} sm={12} xl={8} key={product.id}>
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                      />
                    </Col>
                  ))}
                </Row>

                {/* Infinite scroll trigger */}
                <div ref={infiniteRef} className="mt-8">
                  {isLoadingMore && (
                    <div className="text-center">
                      <Loading size="default" tip="Đang tải thêm sản phẩm..." />
                    </div>
                  )}
                  {!hasNextPage && products.length > 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Đã hiển thị tất cả sản phẩm
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg">
                <Empty
                  description="Không tìm thấy sản phẩm nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Products;
