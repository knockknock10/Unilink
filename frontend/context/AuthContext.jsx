import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          try {
            const { data } = await api.get('/users/profile');
            const freshUser = { ...parsed, ...data, token: storedToken };
            localStorage.setItem('user', JSON.stringify(freshUser));
            setUser(freshUser);
          } catch {}
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (!data || !data.token || !data.user) throw new Error('Invalid server response');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, name: data.user.name };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await api.put('/users/profile', userData);
      const newUserData = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
