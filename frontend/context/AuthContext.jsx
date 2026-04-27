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
          // Set stored user immediately so UI renders
          const parsed = JSON.parse(storedUser);
          setUser(parsed);

          // Then refresh from server to get latest followers/following counts
          try {
            const { data } = await api.get('/users/profile');
            const freshUser = { ...parsed, ...data, token: storedToken };
            localStorage.setItem('user', JSON.stringify(freshUser));
            setUser(freshUser);
          } catch {
            // If refresh fails, keep stored user — don't log out
          }
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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, name: data.user.name };
    } catch (error) {
      const errData = error.response?.data;
      const message = errData?.message
        || errData?.errors?.map(e => e.msg).join(', ')
        || 'Invalid credentials';
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      // Note: Backend now only returns a success message, not user data/token.
      // The user must log in after registering.
      return { success: true, message: data.message };
    } catch (error) {
      const errData = error.response?.data;
      const message = errData?.message
        || errData?.errors?.map(e => e.msg).join(', ')
        || 'Registration failed';
      return { success: false, message };
    }
  };

  // Update profile text fields (name, bio, department, year, skills, interests)
  const updateProfile = async (userData) => {
    try {
      const { data } = await api.put('/users/profile', userData);
      const newUserData = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  // Upload profile picture (file upload)
  const updateProfilePic = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      // Do NOT set Content-Type manually — axios sets multipart/form-data + boundary automatically
      const { data } = await api.put('/users/profile-pic', formData);
      const current = user || {};
      const newUserData = { ...current, ...data };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile picture update failed'
      };
    }
  };

  // Upload banner image (file upload)
  const updateBanner = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      // Do NOT set Content-Type manually — axios sets multipart/form-data + boundary automatically
      const { data } = await api.put('/users/banner', formData);
      const current = user || {};
      const newUserData = { ...current, ...data };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Banner update failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  // Re-fetch fresh user data from server (call after follow/unfollow to sync counts)
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, message: 'Not authenticated' };
      const { data } = await api.get('/users/profile');
      const freshUser = { ...data, token };
      localStorage.setItem('user', JSON.stringify(freshUser));
      setUser(freshUser);
      return { success: true, data: freshUser };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Refresh failed' };
    }
  };

  const toggleFollow = async (userId) => {
    if (!user) return { success: false, message: 'Not authenticated' };

    const targetId = userId?._id ? String(userId._id) : String(userId);
    const followingIds = (user.following || []).map(id => id?._id ? String(id._id) : String(id));
    const isCurrentlyFollowing = followingIds.includes(targetId);

    // 1. Optimistic Update
    const originalFollowing = [...(user.following || [])];
    const newFollowing = isCurrentlyFollowing
      ? originalFollowing.filter(id => (id?._id ? String(id._id) : String(id)) !== targetId)
      : [...originalFollowing, targetId];
    
    setUser(prev => ({ ...prev, following: newFollowing }));

    try {
      const url = `/users/${targetId}/${isCurrentlyFollowing ? 'unfollow' : 'follow'}`;
      const { data } = await api.put(url);

      const updatedCurrentUser = data.updatedCurrentUser;
      if (updatedCurrentUser) {
        const token = localStorage.getItem('token');
        const newUserData = { ...user, ...updatedCurrentUser, token };
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
      }

      return {
        success: true,
        wasFollowing: isCurrentlyFollowing,
        isNowFollowing: !isCurrentlyFollowing,
        followersCount: data.followersCount,
        followingCount: data.followingCount,
      };
    } catch (error) {
      // 2. Rollback
      setUser(prev => ({ ...prev, following: originalFollowing }));
      return {
        success: false,
        message: error.response?.data?.message || 'Action failed'
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      updateProfilePic,
      updateBanner,
      toggleFollow,
      refreshUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
