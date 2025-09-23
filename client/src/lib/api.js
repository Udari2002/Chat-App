import axios from 'axios';

// Base URL for your API - using import.meta.env instead of process.env for Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Users API endpoints  
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (id, userData) => api.put(`/users/${id}`, userData),
  updateOnlineStatus: (status) => api.patch('/users/online-status', { isOnline: status }),
};

// Messages API endpoints
export const messagesAPI = {
  getMessages: (chatId) => api.get(`/messages/${chatId}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
};

export default api;