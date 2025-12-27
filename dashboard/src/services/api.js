import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateStatus: (status) => api.put('/auth/status', { status }),
  logout: () => api.post('/auth/logout'),
};

// Conversations API
export const conversationsAPI = {
  getAll: (params) => api.get('/conversations', { params }),
  getById: (id) => api.get(`/conversations/${id}`),
  assign: (id, agentId) => api.put(`/conversations/${id}/assign`, { agentId }),
  transfer: (id, agentId) => api.put(`/conversations/${id}/transfer`, { agentId }),
  resolve: (id) => api.put(`/conversations/${id}/resolve`),
  close: (id) => api.put(`/conversations/${id}/close`),
  rate: (id, rating, comment) => api.put(`/conversations/${id}/rate`, { rating, comment }),
};

// Messages API
export const messagesAPI = {
  getByConversation: (conversationId, params) => api.get(`/messages/${conversationId}`, { params }),
  send: (data) => api.post('/messages', data),
  markRead: (id) => api.put(`/messages/${id}/read`),
  markAllRead: (conversationId) => api.put(`/messages/conversation/${conversationId}/read-all`),
};

// Visitors API
export const visitorsAPI = {
  getAll: (params) => api.get('/visitors', { params }),
  getById: (id) => api.get(`/visitors/${id}`),
  update: (id, data) => api.put(`/visitors/${id}`, data),
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getCharts: (period) => api.get('/analytics/charts', { params: { period } }),
  getAgents: () => api.get('/analytics/agents'),
};

// Canned Responses API
export const cannedResponsesAPI = {
  getAll: (params) => api.get('/canned-responses', { params }),
  getById: (id) => api.get(`/canned-responses/${id}`),
  create: (data) => api.post('/canned-responses', data),
  update: (id, data) => api.put(`/canned-responses/${id}`, data),
  delete: (id) => api.delete(`/canned-responses/${id}`),
};

export default api;
