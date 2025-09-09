import { useSelector, useDispatch } from "react-redux";
import {
  login,
  register,
  logout,
  getProfile,
  clearError,
} from "../store/authSlice";

export const useAuth = () => {
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
