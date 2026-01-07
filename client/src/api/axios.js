import axios from 'axios';

/**
 * Axios instance with base configuration
 * Handles authentication token injection and error responses
 */

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
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

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - clear token and redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Return the full error response (not just data) - THIS IS THE KEY FIX
      return Promise.reject(error);
    } else if (error.request) {
      // Network error
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection.',
      });
    } else {
      return Promise.reject({
        success: false,
        message: 'An unexpected error occurred.',
      });
    }
  }
);

export default api;

/**
 * SECURITY NOTE:
 * Currently using localStorage for JWT token storage for simplicity.
 *
 * Production recommendations:
 * 1. Use httpOnly cookies for token storage (more secure, prevents XSS attacks)
 * 2. Implement refresh token mechanism for better security
 * 3. Consider using a secure state management library
 *
 * localStorage pros:
 * - Simple to implement
 * - Works well for demos and prototypes
 * - Easy to access in JavaScript
 *
 * localStorage cons:
 * - Vulnerable to XSS attacks
 * - Not automatically sent with requests
 *
 * httpOnly cookie pros:
 * - Not accessible via JavaScript (XSS protection)
 * - Automatically sent with requests
 * - Can set secure and sameSite flags
 *
 * To implement httpOnly cookies:
 * - Backend: Set token in cookie instead of response body
 * - Frontend: Remove localStorage usage, rely on automatic cookie sending
 * - Use credentials: 'include' in fetch/axios config
 */