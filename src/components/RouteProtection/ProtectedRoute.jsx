import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { localToken } from '@/utils/token';
import { USER_ROLES, hasRole } from '@/utils/jwt';
import { PATHS } from '@/constant/path';

/**
 * Role-based route protection component
 * @param {number} requiredRole - The role ID required to access this route
 * @param {string} redirectPath - Path to redirect if not authorized
 */
export const ProtectedRoute = ({ 
  requiredRole, 
  redirectPath = PATHS.HOME,
  children 
}) => {
  const authData = localToken.get();
  const isAuthorized = authData?.userId && hasRole(authData.userId, requiredRole);

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

/**
 * Admin route protection - only allows admins
 */
export const AdminRoute = (props) => {
  return <ProtectedRoute requiredRole={USER_ROLES.ADMIN} {...props} />;
};

/**
 * Doctor route protection - only allows doctors
 */
export const DoctorRoute = (props) => {
  return <ProtectedRoute requiredRole={USER_ROLES.DOCTOR} {...props} />;
};

/**
 * Staff route protection - only allows staff
 */
export const StaffRoute = (props) => {
  return <ProtectedRoute requiredRole={USER_ROLES.STAFF} {...props} />;
};

/**
 * Patient route protection - only allows patients
 */
export const PatientRoute = (props) => {
  return <ProtectedRoute requiredRole={USER_ROLES.PATIENT} {...props} />;
};
