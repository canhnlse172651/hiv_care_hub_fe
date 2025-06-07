import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { localToken } from '@/utils/token';
import { isAdmin } from '@/utils/jwt';
import { PATHS } from '@/constant/path';
import { Spin } from 'antd';

/**
 * Admin route guard component
 * Redirects non-admin users away from admin routes
 */
const AdminRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Simple check to see if the user has an admin token
    const token = localToken.get()?.accessToken;
    if (token && isAdmin(token)) {
      setAuthorized(true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="Verifying admin access..." />
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return children;
};

export default AdminRoute;
