import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Clubs API
export const clubsAPI = {
  getAll: () => api.get('/clubs'),
  getById: (id) => api.get(`/clubs/${id}`),
  join: (id) => api.post(`/clubs/${id}/join`),
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`),
};

// Announcements API
export const announcementsAPI = {
  getAll: () => api.get('/announcements'),
  getByClub: (clubId) => api.get(`/announcements/club/${clubId}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
  createRequest: (data) => api.post('/announcements/requests', data),
};

// Feedback API
export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
  getByEvent: (eventId) => api.get(`/feedback/event/${eventId}`),
};

export default api;
