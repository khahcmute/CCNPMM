import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Typography, Empty, Input, Tag } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { useProducts } from "../hooks/useProducts";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useDebounce } from "../hooks/useDebounce";
import ProductCard from "../components/product/ProductCard";
import ProductFilter from "../components/product/ProductFilter";
import Loading from "../components/common/Loading";
import { ITEMS_PER_PAGE } from "../utils/constants";
import storageService from "../utils/storage";

const { Title } = Typography;
const { Search: AntSearch } = Input;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [recentSearches, setRecentSearches] = useState([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    products,
    pagination,
    filters,
    loading,
    error,
    hasNextPage,
    isLoadingMore,
    searchProducts,
    updateFilters,
    resetFilters,
  } = useProducts();

  // Load recent searches
  useEffect(() => {
    setRecentSearches(storageService.getRecentSearches());
  }, []);

  // Update URL when search query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("q", debouncedSearchQuery);
        return newParams;
      });
    } else {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("q");
        return newParams;
      });
    }
  }, [debouncedSearchQuery, setSearchParams]);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      query: searchParams.get("q") || "",
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

  // Search products when filters change
  useEffect(() => {
    if (filters.query) {
      const params = {
        q: filters.query,
        page: 1,
        limit: ITEMS_PER_PAGE,
        ...filters,
      };

      searchProducts(params);

      // Save to recent searches
      if (filters.query.trim()) {
        storageService.addRecentSearch(filters.query.trim());
        setRecentSearches(storageService.getRecentSearches());
      }
    }
  }, [filters, searchProducts]);

  // Infinite scroll handler
  const handleLoadMore = useCallback(
    (page) => {
      if (hasNextPage && !isLoadingMore && filters.query) {
        const params = {
          q: filters.query,
          page,
          limit: ITEMS_PER_PAGE,
          ...filters,
        };
        searchProducts(params);
      }
    },
    [hasNextPage, isLoadingMore, filters, searchProducts]
  );

  const { ref: infiniteRef, resetPage } = useInfiniteScroll({
    hasNextPage,
    isLoading: isLoadingMore,
    onLoadMore: handleLoadMore,
  });

  // Reset page when search query changes
  useEffect(() => {
    resetPage();
  }, [debouncedSearchQuery, resetPage]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    setSearchParams({ q: query });
  };

  const handleRemoveRecentSearch = (query, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== query);
    storageService.clearRecentSearches();
    updated.forEach((s) => storageService.addRecentSearch(s));
    setRecentSearches(updated);
  };

  const handleClearAllRecentSearches = () => {
    storageService.clearRecentSearches();
    setRecentSearches([]);
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
  };

  const handleAddToWishlist = (product) => {
    console.log("Add to wishlist:", product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <Title level={2}>Tìm kiếm sản phẩm</Title>

          <div className="max-w-2xl">
            <AntSearch
              size="large"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              className="mb-4"
            />

            {/* Recent Searches */}
            {recentSearches.length > 0 && !searchQuery && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    Tìm kiếm gần đây:
                  </span>
                  <button
                    onClick={handleClearAllRecentSearches}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((query, index) => (
                    <Tag
                      key={index}
                      className="cursor-pointer hover:bg-blue-50"
                      closable
                      closeIcon={<CloseOutlined />}
                      onClose={(e) => handleRemoveRecentSearch(query, e)}
                      onClick={() => handleRecentSearchClick(query)}
                    >
                      {query}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Results Info */}
          {filters.query && pagination && (
            <div className="text-gray-600">
              <span>Kết quả tìm kiếm cho "</span>
              <span className="font-medium text-gray-900">{filters.query}</span>
              <span>": {pagination.totalItems} sản phẩm</span>
            </div>
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
                showSearchFilter={false}
              />
            </div>
          </Col>

          {/* Search Results */}
          <Col xs={24} lg={18}>
            {!filters.query ? (
              <div className="bg-white p-12 rounded-lg text-center">
                <SearchOutlined className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Nhập từ khóa để tìm kiếm sản phẩm
                </p>
              </div>
            ) : loading && products.length === 0 ? (
              <Loading tip="Đang tìm kiếm..." />
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
                      <Loading size="default" tip="Đang tải thêm kết quả..." />
                    </div>
                  )}
                  {!hasNextPage && products.length > 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Đã hiển thị tất cả kết quả tìm kiếm
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg">
                <Empty
                  description={`Không tìm thấy sản phẩm nào cho "${filters.query}"`}
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

export default Search;
