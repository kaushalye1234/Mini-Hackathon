import api from "./api";

export const categories = [
  "Electronics",
  "Wallet / Purse",
  "ID / Documents",
  "Books",
  "Clothing",
  "Bags",
  "Keys",
  "Accessories",
  "Other"
];

export const statuses = ["LOST", "RESOLVED"];

export const getLostItems = async (params = {}) => {
  const response = await api.get("/lost-items", { params });
  return response.data;
};

export const getMyLostItems = async () => {
  const response = await api.get("/lost-items/my");
  return response.data;
};

export const getLostItemById = async (id) => {
  const response = await api.get(`/lost-items/${id}`);
  return response.data;
};

export const createLostItem = async (data) => {
  const response = await api.post("/lost-items", data);
  return response.data;
};

export const updateLostItem = async (id, data) => {
  const response = await api.put(`/lost-items/${id}`, data);
  return response.data;
};

export const deleteLostItem = async (id) => {
  const response = await api.delete(`/lost-items/${id}`);
  return response.data;
};

export const resolveLostItem = async (id) => {
  const response = await api.patch(`/lost-items/${id}/resolve`);
  return response.data;
};
