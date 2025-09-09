export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    PROFILE: "/auth/profile",
  },
  PRODUCTS: {
    LIST: "/products",
    SEARCH: "/products/search",
    CATEGORIES: "/products/categories",
    FEATURED: "/products/featured",
    SUGGESTIONS: "/products/suggestions",
    BY_CATEGORY: "/products/category",
  },
  USERS: {
    PROFILE: "/users/profile",
  },
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá thấp đến cao" },
  { value: "price_desc", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "views", label: "Xem nhiều nhất" },
  { value: "name", label: "Tên A-Z" },
];

export const PRICE_RANGES = [
  { min: null, max: null, label: "Tất cả giá" },
  { min: 0, max: 100, label: "Dưới $100" },
  { min: 100, max: 500, label: "$100 - $500" },
  { min: 500, max: 1000, label: "$500 - $1000" },
  { min: 1000, max: null, label: "Trên $1000" },
];

export const ITEMS_PER_PAGE = 20;
