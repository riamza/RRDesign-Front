import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles param is passed, restrict access
  if (roles && !roles.includes(user?.role)) {
     // If user is logged in but doesn't have the role, maybe redirect to home or profile?
     // For now, let's redirect to home to avoid infinite loop on login page
     return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
