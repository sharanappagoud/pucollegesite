import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const userRoles = user?.roles || [];
  
  // Super admin always has access
  if (userRoles.includes('ROLE_SUPER_ADMIN')) {
    return children;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(r => userRoles.includes(r));
    if (!hasRole) {
      return <Navigate to="/admin/login" state={{ from: location, accessDenied: true }} replace />;
    }
  } else if (requiredRole && !userRoles.includes(requiredRole)) {
    return <Navigate to="/admin/login" state={{ from: location, accessDenied: true }} replace />;
  }

  return children;
};
