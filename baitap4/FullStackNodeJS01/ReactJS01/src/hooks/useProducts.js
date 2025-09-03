// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { productAPI } from "../services/productService";

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    categoryId: "all",
    searchTerm: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 12,
    ...initialFilters,
  });

  // Reset và load sản phẩm từ đầu
  const resetAndLoadProducts = useCallback(async () => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setInitialLoading(true);

    try {
      let response;
      const { categoryId, searchTerm, sortBy, sortOrder, limit } = filters;

      if (searchTerm.trim()) {
        response = await productAPI.searchProducts(
          searchTerm,
          categoryId,
          1,
          limit
        );
      } else {
        response = await productAPI.getProductsByCategory(
          categoryId,
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
  }, [filters]);

  // Load thêm sản phẩm (Lazy Loading)
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      let response;
      const { categoryId, searchTerm, sortBy, sortOrder, limit } = filters;

      if (searchTerm.trim()) {
        response = await productAPI.searchProducts(
          searchTerm,
          categoryId,
          currentPage,
          limit
        );
      } else {
        response = await productAPI.getProductsByCategory(
          categoryId,
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
  }, [currentPage, filters, loading, hasMore]);

  // Cập nhật filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Load lại khi filters thay đổi
  useEffect(() => {
    resetAndLoadProducts();
  }, [resetAndLoadProducts]);

  return {
    products,
    loading,
    initialLoading,
    hasMore,
    pagination,
    filters,
    loadMoreProducts,
    updateFilters,
    resetAndLoadProducts,
  };
};

// src/hooks/useProductDetail.js
import { useState, useEffect } from "react";
import { message } from "antd";
import { productAPI } from "../services/productService";

export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductDetail = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getProductById(productId);

        if (response.EC === 0) {
          setProduct(response.DT);
        } else {
          setError(response.EM);
          message.error(response.EM);
        }
      } catch (error) {
        const errorMessage = "Không thể tải thông tin sản phẩm";
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetail();
  }, [productId]);

  return { product, loading, error, refetch: () => loadProductDetail() };
};

// src/hooks/useCategories.js
import { useState, useEffect } from "react";
import { message } from "antd";
import { productAPI } from "../services/productService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getAllCategories();

        if (response.EC === 0) {
          setCategories(response.DT);
        } else {
          setError(response.EM);
          message.error(response.EM);
        }
      } catch (error) {
        const errorMessage = "Không thể tải danh sách danh mục";
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};

// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  // Lấy giá trị từ localStorage hoặc sử dụng giá trị mặc định
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Hàm để cập nhật giá trị
  const setValue = (value) => {
    try {
      // Cho phép value là function để cập nhật giá trị dựa trên giá trị hiện tại
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// src/hooks/useDebounce.js
import { useState, useEffect } from "react";

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// src/hooks/useInfiniteScroll.js
import { useState, useEffect, useCallback } from "react";

export const useInfiniteScroll = (fetchMore, hasMore) => {
  const [isFetching, setIsFetching] = useState(false);

  // Kiểm tra khi scroll đến cuối trang
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    ) {
      return;
    }
    if (hasMore) {
      setIsFetching(true);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchMoreData = async () => {
      await fetchMore();
      setIsFetching(false);
    };

    fetchMoreData();
  }, [isFetching, fetchMore]);

  return [isFetching, setIsFetching];
};
