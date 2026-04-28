import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD && (!envUrl || envUrl.includes('localhost'))) {
    return '/api';
  }
  return (envUrl || '') + '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    const url = error.config?.url || '';
    if (!url.includes('/auth/login') && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api;
