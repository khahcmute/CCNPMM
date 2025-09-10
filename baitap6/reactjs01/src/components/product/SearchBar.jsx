import React, { useState, useRef, useEffect } from "react";
import { Input, AutoComplete, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import productService from "../../services/productService";
import storageService from "../../utils/storage";

const SearchBar = ({
  placeholder = "Tìm kiếm sản phẩm...",
  size = "middle",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Get suggestions when search value changes
  useEffect(() => {
    if (debouncedSearchValue && debouncedSearchValue.length >= 2) {
      getSuggestions(debouncedSearchValue);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchValue]);

  const getSuggestions = async (query) => {
    try {
      setLoading(true);
      const response = await productService.getSuggestions(query, 5);

      const suggestionOptions = response.data.suggestions.map(
        (item, index) => ({
          value: item.text,
          label: (
            <div className="flex items-center justify-between">
              <span>{item.text}</span>
              <SearchOutlined className="text-gray-400" />
            </div>
          ),
        })
      );

      // Add recent searches if no API suggestions
      if (suggestionOptions.length === 0) {
        const recentSearches = storageService
          .getRecentSearches()
          .filter((search) =>
            search.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 3)
          .map((search) => ({
            value: search,
            label: (
              <div className="flex items-center justify-between">
                <span>{search}</span>
                <span className="text-xs text-gray-400">Tìm kiếm gần đây</span>
              </div>
            ),
          }));

        setSuggestions(recentSearches);
      } else {
        setSuggestions(suggestionOptions);
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    if (value && value.trim()) {
      const query = value.trim();
      storageService.addRecentSearch(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchValue("");
      setSuggestions([]);

      // Blur the input to close mobile keyboard
      if (searchRef.current) {
        searchRef.current.blur();
      }
    }
  };

  const handleSelect = (value) => {
    handleSearch(value);
  };

  return (
    <AutoComplete
      value={searchValue}
      options={suggestions}
      onSelect={handleSelect}
      onSearch={setSearchValue}
      className="w-full"
      notFoundContent={loading ? <Spin size="small" /> : null}
    >
      <Input
        ref={searchRef}
        size={size}
        placeholder={placeholder}
        prefix={<SearchOutlined className="text-gray-400" />}
        onPressEnter={(e) => handleSearch(e.target.value)}
        className="rounded-lg"
      />
    </AutoComplete>
  );
};

export default SearchBar;
