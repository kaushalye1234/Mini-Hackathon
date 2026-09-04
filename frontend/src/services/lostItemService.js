import api from "./api";

/**
 * Lost Item API service — Member 2
 * All functions return response.data
 */

// GET /api/lost-items?search=&category=&status=&location=&date=
export const getAllLostItems = async (params = {}) => {
  const response = await api.get("/lost-items", { params });
  return response.data;
};

// GET /api/lost-items/my  (requires auth)
export const getMyLostItems = async () => {
  const response = await api.get("/lost-items/my");
  return response.data;
};

// GET /api/lost-items/:id
export const getLostItemById = async (id) => {
  const response = await api.get(`/lost-items/${id}`);
  return response.data;
};

// POST /api/lost-items  (requires auth)
export const createLostItem = async (data) => {
  const response = await api.post("/lost-items", data);
  return response.data;
};

// PUT /api/lost-items/:id  (requires auth, owner only)
export const updateLostItem = async (id, data) => {
  const response = await api.put(`/lost-items/${id}`, data);
  return response.data;
};

// DELETE /api/lost-items/:id  (requires auth, owner only)
export const deleteLostItem = async (id) => {
  const response = await api.delete(`/lost-items/${id}`);
  return response.data;
};

// PATCH /api/lost-items/:id/resolve  (requires auth, owner only)
export const resolveLostItem = async (id) => {
  const response = await api.patch(`/lost-items/${id}/resolve`);
  return response.data;
};
