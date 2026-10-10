import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session on initial page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.data.user) {
          setUser(res.data.data.user);
        }
      } catch (err) {
        // Session not present or expired, clear local token
        localStorage.removeItem('fittrack_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login handler
  const login = async (emailOrUsername, password) => {
    const res = await api.post('/auth/login', {
      email: emailOrUsername,
      password,
    });

    if (res.data.success) {
      const { user: loggedInUser, token } = res.data.data;
      if (token) {
        localStorage.setItem('fittrack_token', token);
      }
      setUser(loggedInUser);
      return loggedInUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  // Register handler
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { user: registeredUser, token } = res.data.data;
      if (token) {
        localStorage.setItem('fittrack_token', token);
      }
      setUser(registeredUser);
      return registeredUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err.message);
    } finally {
      localStorage.removeItem('fittrack_token');
      setUser(null);
    }
  };

  // Update profile details in context
  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
