import React from "react";
import { Card, Tag, Rate, Button, Tooltip } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  formatPrice,
  calculateDiscountPercentage,
  getStockStatus,
} from "../../utils/helpers";

const { Meta } = Card;

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  className = "",
}) => {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount
    ? calculateDiscountPercentage(product.price, product.salePrice)
    : 0;
  const finalPrice = product.salePrice || product.price;
  const stockStatus = getStockStatus(product.stock);

  const actions = [
    <Tooltip title="Thêm vào giỏ hàng">
      <Button
        type="text"
        icon={<ShoppingCartOutlined />}
        onClick={() => onAddToCart?.(product)}
        disabled={product.stock === 0}
      />
    </Tooltip>,
    <Tooltip title="Thêm vào yêu thích">
      <Button
        type="text"
        icon={<HeartOutlined />}
        onClick={() => onAddToWishlist?.(product)}
      />
    </Tooltip>,
    <Tooltip title="Xem chi tiết">
      <Link to={`/products/${product.slug}`}>
        <Button type="text" icon={<EyeOutlined />} />
      </Link>
    </Tooltip>,
  ];

  return (
    <Card
      className={`product-card hover:shadow-lg transition-shadow duration-200 ${className}`}
      cover={
        <div className="relative">
          <Link to={`/products/${product.slug}`}>
            <img
              alt={product.name}
              src={product.images?.[0] || "/placeholder.png"}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
          </Link>

          {hasDiscount && (
            <div className="absolute top-2 left-2">
              <Tag color="red" className="font-bold">
                -{discountPercentage}%
              </Tag>
            </div>
          )}

          <div className="absolute top-2 right-2">
            <Tag color={stockStatus.color} size="small">
              {stockStatus.text}
            </Tag>
          </div>

          {product.isFeatured && (
            <div className="absolute bottom-2 left-2">
              <Tag color="gold">Nổi bật</Tag>
            </div>
          )}
        </div>
      }
      actions={actions}
    >
      <Meta
        title={
          <Link
            to={`/products/${product.slug}`}
            className="text-gray-900 hover:text-blue-600 transition-colors"
          >
            <Tooltip title={product.name}>
              <div className="truncate font-medium">{product.name}</div>
            </Tooltip>
          </Link>
        }
        description={
          <div className="space-y-2">
            {product.shortDescription && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {product.shortDescription}
              </p>
            )}

            <div className="flex items-center space-x-2">
              <Rate disabled defaultValue={product.rating || 0} size="small" />
              <span className="text-xs text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(finalPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Kho: {product.stock}</span>
              <span>Lượt xem: {product.views || 0}</span>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
