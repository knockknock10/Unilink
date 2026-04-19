import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullPage />;

  // Not logged in → redirect to admin login
  if (!user) return <Navigate to="/admin/login" replace />;

  // Logged in but not admin → redirect to admin login with message
  if (user.role !== 'admin') return <Navigate to="/admin/login" replace />;

  return children;
};

export default AdminRoute;
