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
      // Auto-login for testing
      const dummyUser = {
        id: '1',
        username: 'demo_user',
        fullName: 'Demo User',
        email: 'demo@example.com',
        profilePicture: null,
        coverPhoto: null,
        bio: 'Testing the amazing new UI!',
        followers: [],
        following: [],
      };

      setUser(dummyUser);
      setToken('demo-token');
      localStorage.setItem('user', JSON.stringify(dummyUser));
      localStorage.setItem('token', 'demo-token');
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
const login = async (data) => {
  try {
    const response = await api.post('/api/auth/login', data );

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
      console.log(response.data.message)
      return {
        success: false,
        message: response.data.message || 'Login failed',
      };
    }
  } catch (error) {
    // Handle backend error messages (e.g., Aadhaar mismatch)
    const backendMsg =
      error.response?.data?.message || error.message || 'Login failed';
    console.log(backendMsg);  
    return {
      success: false,
      message: backendMsg,
    };
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
