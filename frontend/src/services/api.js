import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
  }
  return '/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('svcpuc_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors uniformly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If unauthorized/forbidden and currently in admin route, clear token and redirect to login (unless in demo offline mode)
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        const savedUser = localStorage.getItem('svcpuc_user');
        if (!savedUser || !savedUser.includes('"isOfflineMode":true')) {
          localStorage.removeItem('svcpuc_token');
          localStorage.removeItem('svcpuc_user');
          window.location.href = '/admin/login';
        }
      }
    }
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
