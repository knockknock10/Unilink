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
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        // Corrupted localStorage data — clear it
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
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      return { success: true };
    } catch (error) {
      const data = error.response?.data;
      const message = data?.message 
        || data?.errors?.map(e => e.msg).join(', ') 
        || 'Invalid credentials';
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      
      // Auto-login after registration
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);

      return { success: true };
    } catch (error) {
      const data = error.response?.data;
      const message = data?.message 
        || data?.errors?.map(e => e.msg).join(', ') 
        || 'Registration failed';
      return { success: false, message };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await api.put('/users/profile', userData);
      
      const newUserData = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const toggleFollow = async (userId) => {
    try {
      const isFollowing = user?.following?.includes(userId);
      const url = `/users/${userId}/${isFollowing ? 'unfollow' : 'follow'}`;
      await api.put(url);
      
      const updatedFollowing = isFollowing 
        ? user.following.filter(id => id !== userId) 
        : [...(user.following || []), userId];
        
      const newUserData = { ...user, following: updatedFollowing };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Action failed' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, toggleFollow, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
