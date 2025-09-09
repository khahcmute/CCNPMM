import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../services/productService";

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await productService.getFeaturedProducts(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    featuredProducts: [],
    categories: [],
    currentProduct: null,
    pagination: null,
    filters: {
      query: "",
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      sortBy: "newest",
      onSale: false,
      featured: false,
      inStock: false,
      minRating: null,
    },
    loading: false,
    error: null,
    hasNextPage: false,
    isLoadingMore: false,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    appendProducts: (state, action) => {
      state.products = [...state.products, ...action.payload];
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        query: "",
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        sortBy: "newest",
        onSale: false,
        featured: false,
        inStock: false,
        minRating: null,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state, action) => {
        if (action.meta.arg?.page > 1) {
          state.isLoadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoadingMore = false;

        if (action.meta.arg?.page > 1) {
          state.products = [...state.products, ...action.payload.products];
        } else {
          state.products = action.payload.products;
        }

        state.pagination = action.payload.pagination;
        state.hasNextPage = action.payload.pagination.hasNext;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.isLoadingMore = false;
        state.error = action.payload;
      })
      // Search Products
      .addCase(searchProducts.pending, (state, action) => {
        if (action.meta.arg?.page > 1) {
          state.isLoadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoadingMore = false;

        if (action.meta.arg?.page > 1) {
          state.products = [...state.products, ...action.payload.products];
        } else {
          state.products = action.payload.products;
        }

        state.pagination = action.payload.pagination;
        state.hasNextPage = action.payload.pagination.hasNext;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.isLoadingMore = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
      })
      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.products;
      });
  },
});

export const {
  setProducts,
  appendProducts,
  setCurrentProduct,
  setFilters,
  resetFilters,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
