import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { localToken } from '@/utils/token';
import { USER_ROLES, hasRole } from '@/utils/jwt';
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
  const auth = localToken.get();
  const userRole = auth?.user?.role || null;
  
  console.log('Auth data:', auth);
  console.log('User role:', userRole);
  console.log('Required role:', requiredRole);
  
  // Check if user is authenticated and has the required role
  const isAuthenticated = !!auth?.accessToken;
  const isAuthorized = isAuthenticated && hasRole(userRole, requiredRole);

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting');
    return <Navigate to={PATHS.LOGIN || '/login'} replace />;
  }

  if (!isAuthorized) {
    console.log(`User with role ${userRole} is not authorized for required role ${requiredRole}, redirecting to ${redirectPath}`);
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
