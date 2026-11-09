import axios from "axios";

const configuredUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
const apiUrl = configuredUrl || "http://localhost:5000/api";

const api = axios.create({
  baseURL: apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
