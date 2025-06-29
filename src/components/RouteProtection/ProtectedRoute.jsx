import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authManager } from '@/utils/auth';
import { USER_ROLES } from '@/utils/jwt';
import { PATHS } from '@/constant/path';

/**
 * Role-based route protection component
 * @param {string} requiredRole - The role required to access this route
 * @param {string} redirectPath - Path to redirect if not authorized
 */
export const ProtectedRoute = ({ 
  requiredRole, 
  redirectPath = PATHS.HOME,
  children 
}) => {
  const isAuthenticated = authManager.isAuthenticated();
  const userRole = authManager.getUser()?.role;
  
  // Check if user is authenticated and has the required role
  const isAuthorized = isAuthenticated && authManager.hasRole(requiredRole);

  if (!isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};

/**
 * Admin route protection - only allows admins
 */
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole={USER_ROLES.ADMIN} children={children} />;
};

/**
 * Doctor route protection - only allows doctors
 */
export const DoctorRoute = ({ children }) => {
  return <ProtectedRoute requiredRole={USER_ROLES.DOCTOR} children={children} />;
};

/**
 * Staff route protection - only allows staff
 */
export const StaffRoute = ({ children }) => {
  return <ProtectedRoute requiredRole={USER_ROLES.STAFF} children={children} />;
};

/**
 * Patient route protection - only allows patients
 */
export const PatientRoute = ({ children }) => {
  return <ProtectedRoute requiredRole={USER_ROLES.PATIENT} children={children} />;
};

/**
 * Multi-role route protection - allows any of the specified roles
 */
export const MultiRoleRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = authManager.isAuthenticated();
  const isAuthorized = isAuthenticated && authManager.hasAnyRole(allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return children || <Outlet />;
};
