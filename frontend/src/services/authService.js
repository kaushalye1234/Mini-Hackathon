import api from "./api";

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data, options = {}) => {
  const endpoint = options.requireAdmin ? "/auth/admin/login" : "/auth/login";
  const response = await api.post(endpoint, data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
