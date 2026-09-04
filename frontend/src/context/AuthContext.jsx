import { createContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getCurrentUser();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  const handleAuthSuccess = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (credentials, options = {}) => {
    const data = await authService.login(credentials, options);
    return handleAuthSuccess(data);
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    return handleAuthSuccess(data);
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      setUser
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
