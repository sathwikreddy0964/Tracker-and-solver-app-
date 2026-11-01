import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    const storedToken = localStorage.getItem('tracker_token');
    const storedUser = localStorage.getItem('tracker_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify with backend
        authService
          .getProfile()
          .then((res) => {
            if (res.data && res.data.user) {
              setUser(res.data.user);
              localStorage.setItem('tracker_user', JSON.stringify(res.data.user));
            }
          })
          .catch(() => {
            // Token expired or invalid
            logout();
          })
          .finally(() => setLoading(false));
      } catch (err) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('tracker_token', newToken);
    localStorage.setItem('tracker_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password, role = 'user') => {
    const res = await authService.register({ name, email, password, role });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('tracker_token', newToken);
    localStorage.setItem('tracker_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tracker_token');
    localStorage.removeItem('tracker_user');
  };

  const updateProfile = async (formData) => {
    const res = await authService.updateProfile(formData);
    const { token: newToken, user: updatedUser } = res.data;
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('tracker_token', newToken);
    }
    setUser(updatedUser);
    localStorage.setItem('tracker_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
