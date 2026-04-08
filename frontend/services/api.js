import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Local development base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add authorization token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor for handling responses
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Only auto-logout for stale tokens on protected routes, not during login/register
  if (error.response && error.response.status === 401) {
    const url = error.config?.url || '';
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
    if (!isAuthRoute && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api;
