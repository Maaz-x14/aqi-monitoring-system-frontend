  import axios from 'axios';

  // 1. Hardcode the Local Backend URL
  // We removed the fancy "import.meta.env" stuff for now.
  const api = axios.create({
    baseURL: 'http://localhost:8080/api', 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 2. Request Interceptor: Add Token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 3. Response Interceptor: Handle 401s (Auto-Logout)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Only redirect if we are NOT on the login/register page already
        // This prevents infinite loops if the login API itself returns 401
        if(!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  export default api;