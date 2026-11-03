import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('svcpuc_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('svcpuc_user');
      localStorage.removeItem('svcpuc_token');
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('svcpuc_token'));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      if (res.success && res.data) {
        const { token: jwt, ...userData } = res.data;

        if (!userData.roles?.includes('ROLE_ADMIN')) {
          return { success: false, message: 'This account is not authorized to use the admin portal.' };
        }

        setToken(jwt);
        setUser(userData);
        localStorage.setItem('svcpuc_token', jwt);
        localStorage.setItem('svcpuc_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Login error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('svcpuc_token');
    localStorage.removeItem('svcpuc_user');
    api.post('/auth/logout').catch(() => {});
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
