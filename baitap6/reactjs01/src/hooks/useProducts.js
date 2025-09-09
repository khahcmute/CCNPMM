import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  searchProducts,
  fetchCategories,
  fetchFeaturedProducts,
  setFilters,
  resetFilters,
  clearError,
} from "../store/productSlice";

export const useProducts = () => {
  const dispatch = useDispatch();
  const {
    products,
    featuredProducts,
    categories,
    currentProduct,
    pagination,
    filters,
    loading,
    error,
    hasNextPage,
    isLoadingMore,
  } = useSelector((state) => state.products);

  const getProducts = (params) => {
    return dispatch(fetchProducts(params));
  };

  const searchProductsAction = (params) => {
    return dispatch(searchProducts(params));
  };

  const getCategories = () => {
    return dispatch(fetchCategories());
  };

  const getFeaturedProducts = (limit) => {
    return dispatch(fetchFeaturedProducts(limit));
  };

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const resetProductFilters = () => {
    dispatch(resetFilters());
  };

  const clearProductError = () => {
    dispatch(clearError());
  };

  return {
    products,
    featuredProducts,
    categories,
    currentProduct,
    pagination,
    filters,
    loading,
    error,
    hasNextPage,
    isLoadingMore,
    getProducts,
    searchProducts: searchProductsAction,
    getCategories,
    getFeaturedProducts,
    updateFilters,
    resetFilters: resetProductFilters,
    clearError: clearProductError,
  };
};
