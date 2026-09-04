import api from "./api";

export const sendMessage = async (data) => {
  const response = await api.post("/messages", data);
  return response.data;
};

export const getInbox = async () => {
  const response = await api.get("/messages/inbox");
  return response.data;
};

export const getSent = async () => {
  const response = await api.get("/messages/sent");
  return response.data;
};

export const getMessageById = async (id) => {
  const response = await api.get(`/messages/${id}`);
  return response.data;
};

export const replyToMessage = async (id, data) => {
  const response = await api.post(`/messages/${id}/reply`, data);
  return response.data;
};

export const markMessageRead = async (id) => {
  const response = await api.patch(`/messages/${id}/read`);
  return response.data;
};
