import axios from 'axios';

// Point to your Spring Boot Backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
       // Only redirect if we are NOT on the login/register page already
       if(!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
           localStorage.removeItem('token');
           window.location.href = '/login';
       }
    }
    return Promise.reject(error);
  }
);

export default api;