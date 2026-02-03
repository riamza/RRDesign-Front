import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    if (user?.role === 'Admin') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default PublicRoute;
