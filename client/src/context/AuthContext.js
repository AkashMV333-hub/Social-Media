import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

/**
 * Authentication Context
 * Manages user authentication state globally
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Verify token is still valid
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  // Verify token validity
  const verifyToken = async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (error) {
      // Token invalid or expired
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function (Aadhaar-compatible)
  // Update the login function in AuthContext.js with debugging:

const login = async (data) => {
  try {
    console.log("AuthContext login called with:", data);
    const response = await api.post('/api/auth/login', data);
    console.log("AuthContext login response:", response);
    console.log("Response data:", response.data);

    if (response.data.success) {
      const { user, token } = response.data.data;

      // Store in state
      setUser(user);
      setToken(token);

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      return { success: true };
    } else {
      // Check if there are field-specific errors
      if (response.data.fieldErrors) {
        console.log("Returning field errors from success response:", response.data.fieldErrors);
        return {
          success: false,
          fieldErrors: response.data.fieldErrors,
        };
      } else {
        console.log("Returning general error from success response:", response.data.message);
        return {
          success: false,
          message: response.data.message || 'Login failed',
        };
      }
    }
  } catch (error) {
    console.log("AuthContext login error:", error);
    console.log("Error response:", error.response);
    console.log("Error response data:", error.response?.data);
    
    // Handle backend error messages with field-specific errors
    if (error.response?.data?.fieldErrors) {
      console.log("Returning field errors from error:", error.response.data.fieldErrors);
      return {
        success: false,
        fieldErrors: error.response.data.fieldErrors,
      };
    } else {
      const backendMsg =
        error.response?.data?.message || error.message || 'Login failed';
      console.log("Returning general error:", backendMsg);
      return {
        success: false,
        message: backendMsg,
      };
    }
  }
};

  // ✅ Updated register function for Aadhaar-based registration
  const register = async (formData) => {
    try {
      const response = await api.post('/api/auth/register', formData, {
        headers: {
          // Let Axios handle multipart form boundaries automatically
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const { user, token } = response.data.data || {};

        if (user && token) {
          setUser(user);
          setToken(token);

          // Store in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        }

        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || 'Registration failed',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          'Registration failed',
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Update user in context (after profile update)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;