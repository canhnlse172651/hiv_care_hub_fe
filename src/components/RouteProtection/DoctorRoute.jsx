import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { localToken } from '@/utils/token';
import { hasRole, USER_ROLES } from '@/utils/jwt';

/**
 * Doctor Route - Checks if user has doctor role access
 */
const DoctorRoute = ({ children }) => {
  const auth = localToken.get();
  const userId = auth?.userId || null;

  const isDoctor = hasRole(userId, USER_ROLES.DOCTOR);
  
  if (!auth?.accessToken || !isDoctor) {
    // Redirect to home page if not authenticated or not a doctor
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default DoctorRoute;
