// client/src/lib/api.js
import axios from 'axios';

// Prefer env var so you can switch ports/environments easily.
// In Vite, define: VITE_API_URL=http://localhost:5000
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true, // enable only if you use cookies/sessions
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Pass server error messages through so the UI can show them
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Normalize common server error shapes to { message: string }
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Request failed';
    return Promise.reject({ ...err, message: msg });
  }
);

// ===== Auth API =====
export const authAPI = {
  // expects { fullName, email, password }
  register: (userData) => api.post('/auth/register', userData),

  // expects { email, password }
  login: (credentials) => api.post('/auth/login', credentials),

  // requires Bearer token
  getCurrentUser: () => api.get('/auth/me'),
};

// ===== Users API =====
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  updateOnlineStatus: (isOnline) => api.put('/users/online', { isOnline }),
};

// ===== Messages API =====
export const messagesAPI = {
  getMessages: (receiverId, page = 1, limit = 50) =>
    api.get(`/messages/${receiverId}?page=${page}&limit=${limit}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
  markAsSeen: (senderId) => api.put(`/messages/seen/${senderId}`),
  getUnreadCount: () => api.get('/messages/unread/count'),
  deleteConversation: (receiverId) => api.delete(`/messages/${receiverId}`),
  deleteMessageForMe: (messageId) => api.delete(`/messages/item/${messageId}`),
  deleteMessageForEveryone: (messageId) => api.delete(`/messages/item/${messageId}?forEveryone=true`),
};

export default api;
