import axios from 'axios';

// If VITE_API_URL is set (Production), use it. 
// Otherwise default to localhost:8080 (Development).
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log("🔗 Connecting to Backend:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
       if(!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
           localStorage.removeItem('token');
           window.location.href = '/login';
       }
    }
    return Promise.reject(error);
  }
);

export default api;