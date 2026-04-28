import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If we are in production and the env URL is missing or pointing to localhost, use relative path
  if (import.meta.env.PROD && (!envUrl || envUrl.includes('localhost'))) {
    return '/api';
  }
  return (envUrl || '') + '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
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
