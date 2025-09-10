const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  CART: "cart",
  WISHLIST: "wishlist",
  RECENT_SEARCHES: "recentSearches",
  THEME: "theme",
};

class StorageService {
  // Token management
  setTokens(accessToken, refreshToken) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  removeTokens() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // User data
  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  removeUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Cart management
  setCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }

  getCart() {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : [];
  }

  // Wishlist management
  setWishlist(wishlist) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }

  getWishlist() {
    const wishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return wishlist ? JSON.parse(wishlist) : [];
  }

  // Recent searches
  addRecentSearch(query) {
    const searches = this.getRecentSearches();
    const updatedSearches = [
      query,
      ...searches.filter((s) => s !== query),
    ].slice(0, 10);
    localStorage.setItem(
      STORAGE_KEYS.RECENT_SEARCHES,
      JSON.stringify(updatedSearches)
    );
  }

  getRecentSearches() {
    const searches = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return searches ? JSON.parse(searches) : [];
  }

  clearRecentSearches() {
    localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  }

  // Theme
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  }

  // Clear all data
  clearAll() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

export default new StorageService();
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (credentials) => {
    return dispatch(login(credentials));
  };

  const handleRegister = (userData) => {
    return dispatch(register(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleGetProfile = () => {
    return dispatch(getProfile());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getProfile: handleGetProfile,
    clearError: clearAuthError,
  };
};
