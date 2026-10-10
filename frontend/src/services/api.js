import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fittrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Format API error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    const customError = new Error(message);
    customError.response = error.response;
    customError.status = error.response?.status;
    customError.errors = error.response?.data?.errors || [];
    return Promise.reject(customError);
  }
);

export default api;
