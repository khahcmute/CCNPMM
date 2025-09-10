export const formatPrice = (price, currency = "$") => {
  if (!price) return `${currency}0`;
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getImageUrl = (imagePath, defaultImage = "/placeholder.png") => {
  if (!imagePath) return defaultImage;
  if (imagePath.startsWith("http")) return imagePath;
  return `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${imagePath}`;
};

export const calculateDiscountPercentage = (price, salePrice) => {
  if (!price || !salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

export const getStockStatus = (stock) => {
  if (stock > 10) return "Còn hàng";
  if (stock > 0) return "Sắp hết";
  return "Hết hàng";
};

export default {
  formatPrice,
  formatDate,
  truncateText,
  generateSlug,
  getImageUrl,
  calculateDiscountPercentage,
  getStockStatus,
};
