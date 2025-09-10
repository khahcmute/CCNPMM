import React from "react";
import {
  Card,
  Form,
  Select,
  Slider,
  Switch,
  Button,
  Divider,
  Rate,
} from "antd";
import { FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { useProducts } from "../../hooks/useProducts";
import { SORT_OPTIONS, PRICE_RANGES } from "../../utils/constants";

const { Option } = Select;

const ProductFilter = ({
  filters,
  onFilterChange,
  onReset,
  showSearchFilter = true,
}) => {
  const { categories } = useProducts();

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handlePriceRangeChange = (range) => {
    if (range) {
      onFilterChange({
        minPrice: range.min,
        maxPrice: range.max,
      });
    }
  };

  const handleCustomPriceChange = (values) => {
    onFilterChange({
      minPrice: values[0] || null,
      maxPrice: values[1] || null,
    });
  };

  return (
    <Card
      title={
        <div className="flex items-center space-x-2">
          <FilterOutlined />
          <span>Bộ lọc</span>
        </div>
      }
      size="small"
    >
      <Form layout="vertical" size="small">
        {/* Category Filter */}
        <Form.Item label="Danh mục">
          <Select
            placeholder="Chọn danh mục"
            value={filters.categoryId}
            onChange={(value) => handleFilterChange("categoryId", value)}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name} ({category.productCount || 0})
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Sort Filter */}
        <Form.Item label="Sắp xếp">
          <Select
            value={filters.sortBy}
            onChange={(value) => handleFilterChange("sortBy", value)}
          >
            {SORT_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider />

        {/* Price Range */}
        <Form.Item label="Khoảng giá">
          <div className="space-y-3">
            <Select
              placeholder="Chọn khoảng giá"
              onChange={handlePriceRangeChange}
              allowClear
            >
              {PRICE_RANGES.map((range, index) => (
                <Option key={index} value={range}>
                  {range.label}
                </Option>
              ))}
            </Select>

            {/* Custom Price Slider */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Tùy chỉnh giá ($)</p>
              <Slider
                range
                min={0}
                max={2000}
                step={10}
                value={[filters.minPrice || 0, filters.maxPrice || 2000]}
                onChange={handleCustomPriceChange}
                tipFormatter={(value) => `${value}`}
              />
            </div>
          </div>
        </Form.Item>

        <Divider />

        {/* Rating Filter */}
        <Form.Item label="Đánh giá tối thiểu">
          <Rate
            value={filters.minRating || 0}
            onChange={(value) => handleFilterChange("minRating", value)}
          />
        </Form.Item>

        <Divider />

        {/* Boolean Filters */}
        <Form.Item>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Đang khuyến mãi</span>
              <Switch
                checked={filters.onSale}
                onChange={(checked) => handleFilterChange("onSale", checked)}
                size="small"
              />
            </div>

            <div className="flex justify-between items-center">
              <span>Sản phẩm nổi bật</span>
              <Switch
                checked={filters.featured}
                onChange={(checked) => handleFilterChange("featured", checked)}
                size="small"
              />
            </div>

            <div className="flex justify-between items-center">
              <span>Còn hàng</span>
              <Switch
                checked={filters.inStock}
                onChange={(checked) => handleFilterChange("inStock", checked)}
                size="small"
              />
            </div>
          </div>
        </Form.Item>

        <Divider />

        {/* Reset Button */}
        <Button
          type="dashed"
          icon={<ClearOutlined />}
          onClick={onReset}
          className="w-full"
        >
          Xóa bộ lọc
        </Button>
      </Form>
    </Card>
  );
};

export default ProductFilter;
