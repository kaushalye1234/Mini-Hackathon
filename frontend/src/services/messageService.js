import api from "./api";

export const sendMessage = (data) => api.post("/messages", data).then((r) => r.data);

export const getInbox = () => api.get("/messages/inbox").then((r) => r.data);

export const getSent = () => api.get("/messages/sent").then((r) => r.data);

export const getMessageById = (id) => api.get(`/messages/${id}`).then((r) => r.data);

export const replyToMessage = (id, message) =>
  api.post(`/messages/${id}/reply`, { message }).then((r) => r.data);

export const markAsRead = (id) => api.patch(`/messages/${id}/read`).then((r) => r.data);
